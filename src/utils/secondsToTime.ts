const secondsToTime = (totalSeconds: number): string => {
  const sec = (totalSeconds % 60).toString().padStart(2, "0")
  const totalMinutes = Math.floor(totalSeconds / 60)
  const min = (totalMinutes % 60).toString().padStart(2, "0")
  const hours = Math.floor(totalMinutes / 60)
  if(hours === 0){
    return `${min}:${sec}`
  }
  return `${hours}:${min}:${sec}`
}

export default secondsToTime
