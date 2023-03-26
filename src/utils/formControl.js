// 过滤字符串前后空格的输入框
export function inputTextTrim(e) {
  const { value } = e.target
  if (value) {
    return value.trim()
  }
  return value
}

// 只能输入字母和数字的输入框
export function inputOnlyLetterAndNumber(e) {
  const { value } = e.target
  if (value) {
    return value.replace(/[^A-Za-z0-9]/g, '')
  }
  return value
}

// 只能输入金额的输入框
export function inputOnlyMoney(e) {
  const { value } = e.target
  if (value) {
    return value.replace(/[^0-9.]/g, '')
  }
  return value
}

// 只能输入数字的输入框
export function inputOnlyNumber(e) {
  const { value } = e.target
  if (value) {
    return value.replace(/[^0-9]/g, '')
  }
  return value
}
