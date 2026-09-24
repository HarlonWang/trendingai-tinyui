# trendingai-tinyui

TrendingAI 里用 [TinyUI](https://github.com/tiny-ui/tinyui) 写的页面，包名 `trendingai`（页面 `trendingai/subscription`），可热下发。

```
tinyui.config.json  包名与验签公钥（私钥在 GitHub secret TINYUI_SIGNING_KEY，备份在 HarlonWang/secrets）
schema/             宿主组件（ta.Icon、ta.Loading）的 schema，两侧契约
src/pages/          页面，一个文件一个页面
src/host/           宿主能力的类型封装，名字与 TrendingAI 的 tinyui/Capabilities.kt 对应
src/generated/      `pnpm schema` 生成的宿主组件类型（入库）
scripts/sync.mjs    生成 ../TrendingAI 的 HostSchemas.kt
```

## 发布

- 合进 main → `staging.yml` 构建、签名、发 `staging`。`HOST_VERSION` 抄 TrendingAI 的同名常量；`publish` 对照热下发服务上该版本的宿主快照核对，快照不存在或页面用到的东西快照里没有即拒绝
- `production.yml` 手动跑：`promote` / `rollout`，要过 `production` environment 的人工批准
- 回滚：在本仓 revert 合入 main（发一个内容等于旧版的新版本），再 promote。指针只往前走，所有设备都收得到
- 用商店版 App 看 staging：关于页连点版本号 7 次，把「页面更新通道」切到 staging（切换即下载），重启一次生效

依赖的 `tinyui-*` 三包版本须与目标宿主版本的 tinyui 下限兼容：major 相同且不高于它（下限是 TrendingAI `shared/tinyui-host/<HOST_VERSION>.txt` 的 `tinyui` 行，`publish` 据此核对）。运行时随 App，包里只有页面；TrendingAI 单纯升 tinyui 不需要本仓跟着升，页面要用新版运行时的东西时，先等 TrendingAI 加 `HOST_VERSION`、抬下限（tinyui docs/adr-006-hot-updates.md §2.11）。

## 本地

```sh
pnpm install
pnpm typecheck
pnpm sync             # → TrendingAI/…/tinyui/generated/HostSchemas.kt（改了 schema/ 之后）
```

TrendingAI 的内置包由它自己的发版冒烟脚本从 production 刷新（`tinyui pull`），本仓不管。本地改页面要在 App 里看，走 staging（合 main → 切通道），或临时 `pnpm exec tinyui build` 后把 dist 复制过去、不提交。
