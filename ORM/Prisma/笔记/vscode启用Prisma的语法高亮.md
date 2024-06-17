要在 Visual Studio Code (VSCode) 中启用 Prisma 的语法高亮，可以按照以下步骤操作：

### 安装 Prisma VSCode 扩展

1. **打开 VSCode**。
2. **进入扩展市场**：
   - 点击左侧活动栏中的扩展图标（四个方块的图标），或者使用快捷键 `Ctrl+Shift+X`（Windows/Linux）或 `Cmd+Shift+X`（Mac）。
3. **搜索 "Prisma"**：
   - 在搜索栏中输入 "Prisma"。
4. **安装 Prisma 扩展**：
   - 找到名为 “Prisma” 的扩展（由 Prisma Labs 开发），点击 `安装` 按钮。
5. **重新加载 VSCode**：
   - 安装完成后，可能需要重新加载 VSCode 以使扩展生效。

### 配置 Prisma VSCode 扩展

安装扩展后，Prisma 语法高亮和其他功能应该自动启用。如果需要进一步配置，可以在 VSCode 的设置中进行调整：

1. **打开设置**：
   - 点击左下角齿轮图标，然后选择 `设置`，或者使用快捷键 `Ctrl+,`（Windows/Linux）或 `Cmd+,`（Mac）。
2. **搜索 Prisma 设置**：
   - 在设置搜索栏中输入 "Prisma" 以查看相关设置。

### 示例效果

安装并配置完成后，打开 `schema.prisma` 文件时，您应该能够看到 Prisma 语法的高亮显示，以及自动完成、错误检查等功能。

### 手动配置文件类型（如果需要）

有时，VSCode 可能无法自动识别 `schema.prisma` 文件的类型，可以手动设置文件类型：

1. **打开 `schema.prisma` 文件**。
2. **设置文件类型**：
   - 在文件的右下角，点击当前文件类型（例如 `Plain Text`）。
   - 在弹出的菜单中，选择 `Prisma` 作为文件类型。

通过这些步骤，您应该能够在 VSCode 中获得 Prisma 的语法高亮和其他开发辅助功能。