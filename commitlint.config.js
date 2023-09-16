module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'bug', // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
        'chore', // 构建过程或辅助工具的变动
        'docs', // 文档（documentation）
        'feature', // 新功能（feature）
        'fix', // 修补bug
        'merge', // 合并分支， 例如： merge（前端页面）： feature-xxxx修改线程地址
        'refactor', // 重构（即不是新增功能，也不是修改bug的代码变动）
        'revert', // feat(pencil): add 'graphiteWidth' option (撤销之前的commit)
        'style', // 格式（不影响代码运行的变动）
        'test', // 增加测试
      ],
    ],
  },
};
