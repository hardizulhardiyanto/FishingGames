// getRandomPersentage From Object
export const getRandomPersentage = (objects) => {
  // Calculate the total percentage of all objects
  let totalPercentage = objects.reduce(function (total, obj) {
    return total + obj.percentage;
  }, 0);

  // Randomly distribute the remaining percentage to objects
  while (totalPercentage < 100) {
    const availableObjects = objects.filter(function (obj) {
      return obj.percentage < 100;
    });
    const randomIndex = Math.floor(Math.random() * availableObjects.length);
    const increment = Math.min(
      100 - totalPercentage,
      100 - availableObjects[randomIndex].percentage
    );
    availableObjects[randomIndex].percentage += increment;
    totalPercentage += increment;
  }

  return objects;
};

// Generate a random number among 10, 20, or 30
export const getRandomNumber = ()  =>{
    const options = [10, 20, 30];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}

//ex: countPercentage(5,5,50) result: 50
export const countPercentage = (value, setNumber, percentage) => {
  const calculatedValue = (value / setNumber) * percentage;
  return parseInt(calculatedValue.toString().split(".")[0])
}