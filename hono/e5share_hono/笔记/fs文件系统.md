在 Node.js 中，`fs/promises` 和 `fs` 都是用于文件系统操作的模块，但它们提供了不同的 API。

### 区别
1. **`fs/promises`**:
   - **异步 Promise API**: 提供基于 Promise 的异步 API。
   - **便于使用 async/await**: 与现代 JavaScript 的异步编程模式（`async/await`）很好地集成。
   - **简洁的错误处理**: 通过 `.catch` 方法或 `try/catch` 语句块处理错误。

2. **`fs`**:
   - **回调 API**: 提供基于回调的异步 API。
   - **同步 API**: 提供同步 API（例如 `fs.readFileSync`），适合在初始化时使用。
   - **异步回调 API**: 需要使用回调函数处理异步操作的结果和错误。

### 推荐使用
用哪个都可以，还是单纯的用fs吧
```ts
// src\utils\utils.ts
import fs from 'fs'
// 确保保存文件的文件夹存在
export const confirmSaveFolderExists = (dirPath: string) => {
  try {
    // 检查文件夹是否存在
    fs.accessSync(dirPath)
  } catch (err) {
    try {
      fs.mkdirSync(dirPath, { recursive: true })
    } catch (error) {
      throw new AppError('保存目录错误', 500)
    }
  }
}
```

**`fs/promises`**:
- **简洁和现代**: 使用 `async/await` 使代码更简洁和易读。
- **一致性**: 现代项目中推荐统一使用基于 Promise 的异步 API。

**fs适合在初始化时使用**，也有些时候必须用同步的fs




