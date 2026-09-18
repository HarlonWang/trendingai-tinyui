# trendingai-tinyui

TrendingAI 里用 [TinyUI](https://github.com/HarlonWang/tinyui) 写的页面：TSX 在这里，编成字节码后经 `pnpm sync` 复制进 `../TrendingAI` 提交。TrendingAI 的构建不依赖 Node（F-Droid 从源码构建时没有 Node）。

```
schema/          宿主组件（ta.Icon、ta.Loading）的 schema，两侧契约
src/pages/       页面，一个文件一个页面
src/host/        宿主能力（billing / checkout / auth / analytics / ui）的类型封装，与 Kotlin 侧注册的名字对应
src/generated/   `pnpm schema` 生成的宿主组件类型（入库）
scripts/sync.mjs 编译 + 复制
```

## 用法

```sh
pnpm install          # tinyui-* 经 link: 指向 ../../KMPProjects/tinyui/packages，那边先 pnpm build
pnpm typecheck
pnpm sync             # → TrendingAI/shared/src/commonMain/composeResources/files/tinyui/ 与 …/tinyui/generated/HostSchemas.kt
```

`sync` 需要 `qjsc-kmp`：`TINYUI_QJSC` 指向它，或 tinyui 的 `local.properties` 配了 `quickjs-kmp.dir` 且那边跑过 `./gradlew :library:buildHostTools`。

改了 tinyui 的 packages 之后要在 tinyui 里重新 `pnpm build`，再 `pnpm sync`；运行时字节码（`runtime/*.bin`）与 TrendingAI 经 composite build 吃的 tinyui Kotlin 源码必须来自同一个 tinyui 提交。
