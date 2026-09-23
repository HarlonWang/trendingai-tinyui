# trendingai-tinyui

TrendingAI 里用 [TinyUI](https://github.com/tiny-ui/tinyui) 写的页面，包名 `trendingai`（页面 `trendingai/subscription`），可热下发。

```
tinyui.config.json  包名与验签公钥（私钥在 GitHub secret TINYUI_SIGNING_KEY，备份在 HarlonWang/secrets）
schema/             宿主组件（ta.Icon、ta.Loading）的 schema，两侧契约
src/pages/          页面，一个文件一个页面
src/host/           宿主能力的类型封装，名字与 TrendingAI 的 tinyui/Capabilities.kt 对应
src/generated/      `pnpm schema` 生成的宿主组件类型（入库）
scripts/sync.mjs    编译 + 复制进 ../TrendingAI（内置包与 HostSchemas.kt）
```

## 发布

- 合进 main → `staging.yml` 构建、签名、发 `staging`。`HOST_VERSION` 抄 TrendingAI 的同名常量；抄错时 `publish` 对照热下发服务上的宿主快照拒绝发布
- `production.yml` 手动跑：`promote` / `rollback` / `rollout`，要过 `production` environment 的人工批准
- 用商店版 App 看 staging：关于页连点版本号 7 次，把「页面更新通道」切到 staging，重启两次（第一次下载、第二次生效）

依赖的 `tinyui-*` 三包版本必须等于 TrendingAI 的 `tinyui`（`gradle/libs.versions.toml`）：页面字节码与宿主引擎同版本，`publish` 也核对它等于宿主快照里的 tinyui 版本。

## 本地

```sh
pnpm install
pnpm typecheck
pnpm sync             # → TrendingAI/shared/src/commonMain/composeResources/files/tinyui/trendingai/ 与 …/tinyui/generated/HostSchemas.kt
```

TrendingAI 的构建不依赖 Node（F-Droid 从源码构建时没有 Node），内置包由 `sync` 提交进那边。
