#添加好友功能的逻辑

• 我把“加好友/Follow”按“好友=双向关系”完善了，解决「同意后还能反向再发请求」的问题。

- src/lib/actions.ts:7：switchFollow 现在会
    - 已是好友（互相关注）→ 点一次直接删除两条关注（解除好友）
    - 有对方发给我的请求 → 点一次自动同意并建立双向关注（成为好友）
    - 已发出请求 → 再点一次取消请求
    - 否则 → 创建好友请求
- src/lib/actions.ts:91：acceptFollowRequest 同意请求后会建立双向关注，并清理双方之间可能存在的交叉请求。
- src/app/components/rightMenu/UserInfoCardInteraction.tsx:1：前端按钮改为基于 switchFollow 返回值更新状态，文案调整为 Add Friend / Friend Request Sent / Friends。
- prisma/schema.prisma:79：给 Follower 增加 @@unique([followerId, followingId])，并新增迁移 prisma/migrations/20251215160000_add_follower_unique/migration.sql（会
  先去重再建唯一索引）。

你本地需要跑一次迁移让唯一索引生效：npx prisma migrate dev（或你项目对应的 prisma migrate 命令）。

› 解释下使用$transaction的作用和原来写法的对比


• $transaction 的作用：把一组相关的数据库读写当成“一个原子操作”执行，要么全部成功提交，要么其中一步失败就全部回滚，从而保证数据一致性，并减少并发下的竞态问题。

对比你原来的写法（非事务） vs 现在（事务）主要差在这些点：

- 一致性：原来 acceptFollowRequest 是“先删请求、再建关注”。如果删完请求后建关注失败（异常/超时/唯一约束等），会留下“请求没了但也没成为好友”的不一致状态；
  $transaction 会回滚删除，请求仍在。
- 并发竞态：原来 switchFollow 先 findFirst 再 create/delete，两次请求同时点（或重复提交）可能都读到“没有记录”，然后都去 create，导致重复数据/抛错；事务里把相关检查
  +写入捆在一起，并配合 Follower 的唯一约束，能显著降低这种问题（失败会整体回滚）。
- 跨表操作的原子性：现在逻辑会同时改 FollowRequest 和 Follower（还会清理双方请求、建立双向关注）。不用事务很容易出现“删了一半/建了一半”的中间态；事务保证这组跨表变
  更要么全部完成，要么完全不发生。
- 语义更贴近业务：一次“加好友/同意”在业务上就是一个动作；用 prisma.$transaction(async (tx) => ...) 可以确保这个动作对应一次提交，且内部所有查询/写入都用同一个 tx.*
  客户端执行。


› tx 表示 啥


• tx 是 prisma.$transaction(async (tx) => { ... }) 这个回调里传进来的“事务版 Prisma Client”。

- 用 tx.follower/...、tx.followRequest/... 执行的所有查询/写入，都会在同一个数据库事务里。
- 事务函数返回后（没有抛错）→ 自动 COMMIT；中途抛错/失败 → 自动 ROLLBACK。
- 回调外面的 prisma.xxx 是普通 client，不一定在同一个事务里。