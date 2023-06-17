const units = ["B", "kB", "MB", "GB", "TB", "PB"]

const fileSize = (bytes: number): string => {
  if (bytes === 0) {
    return "0 B"
  }
  const siezes = []
  while (bytes > 0) {
    siezes.push(bytes % 1024)
    bytes = Math.floor(bytes / 1024)
  }

  if (siezes.length !== 1) {
    return (
      siezes.pop().toString() +
      "." +
      siezes.pop().toString().slice(0, 2) +
      units[siezes.length + 1]
    )
  }

  return siezes.pop() + units[0]
}

export default fileSize
