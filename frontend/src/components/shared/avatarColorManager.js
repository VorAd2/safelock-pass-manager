const AvatarColorManager = (() => {
  const colors = [
    "#ad4141ff",
    "#b68843ff",
    "#95aa3fff",
    "#5fbd47ff",
    "#46be76ff",
    "#41b8b8ff",
    "#416cadff",
    "#5640afff",
    "#963eacff",
    "#a13a61ff"
  ]
  const usedColors = []
  const userColorsMap = {}

  function getRandomIndex(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function getAvatarBgColor(username) {
    if (userColorsMap[username]) return userColorsMap[username]
    if (usedColors.length === colors.length) usedColors.length = 0
    let color;
    do {
      color = colors[getRandomIndex(0, colors.length - 1)]
    } while (usedColors.includes(color))

    usedColors.push(color)
    userColorsMap[username] = color
    return color
  }

  function removeUserColor(username) {
    if (userColorsMap[username]) {
      const color = userColorsMap[username]
      usedColors.splice(usedColors.indexOf(color), 1)
      delete userColorsMap[username]
    }
  }

  return {
    getAvatarBgColor,
    removeUserColor,
  }
})();

export default AvatarColorManager;
