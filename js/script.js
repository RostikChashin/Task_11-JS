const fruitsList = document.querySelector('.fruits-list'); // список карточек
const mixBtn = document.querySelector('#mixBtn'); // кнопка перемешивания
const minWeightInput = document.querySelector('#minWeightInput'); // поле ввода мин. веса
const maxWeightInput = document.querySelector('#maxWeightInput'); // поле ввода макс. веса
const filterBtn = document.querySelector('#filterBtn'); // кнопка фильтрации
const sortKindInput = document.querySelector('#sortKind'); // поле с названием сортировки
const sortTimeInput = document.querySelector('#sortTime'); // поле с временем сортировки
const sortChangeBtn = document.querySelector('#sortChangeBtn'); // кнопка смены сортировки
const sortActionBtn = document.querySelector('#sortActionBtn'); // кнопка сортировки
const kindInput = document.querySelector('#kindInput'); // поле с названием вида
const colorInput = document.querySelector('#colorInput'); // поле с названием цвета
const weightInput = document.querySelector('#weightInput'); // поле с весом
const addFruitBtn = document.querySelector('#addFruitBtn'); // кнопка добавления
const popup = document.querySelector('.popup-close'); // pop-up
const attempt = document.querySelector('#message'); // тег span popup
const wrapper = document.querySelector('.wrapper'); // оболочка всей страницы
const popupAddFruit = document.querySelector('.popup-add-fruit'); // pop-up 2

// Элементы списка хранятся в формате JSON
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

let listItem, indexField, kindField, colorField, weightField;
function createElements() {
  listItem = document.createElement('li');
  indexField = document.createElement('span');
  kindField = document.createElement('span');
  colorField = document.createElement('span');
  weightField = document.createElement('span');
}

function addElements() {
  listItem.append(indexField, kindField, colorField, weightField);
  fruitsList.append(listItem);
  // добавляем общий класс для всех элементов списка // цвет серый по умол.
  listItem.classList.add('fruits-list__item');
}

// получает на вход массив элементов и отображает их на странице.
const display = (array = fruits) => {
  fruitsList.innerHTML = ''; //  очищаем fruitsList от вложенных элементов,
  array.forEach((element, index) => {
    createElements();
    indexField.textContent = `Индекс: ${index}`;
    kindField.textContent = `Вид: ${element.kind}`;
    colorField.textContent = `Цвет: ${element.color}`;
    weightField.textContent = `Вес: ${element.weight}`;
    addElements();
    setBorderColor();
  });
};

window.onload = display(); // первая отрисовка карточек при загрузке страницы

// ------- ФИЛЬТРАЦИЯ ------
// пустой массив, мин. вес, макс. вес, кол-во кликов по кнопке перемешать
let fruitsFiltered = [],
  minValue,
  maxValue,
  count = 0;
// получаем значения мин и макс, проверяем их, выводим в текстовое поле
function getStartValue() {
  minValue = parseInt(minWeightInput.value);
  maxValue = parseInt(maxWeightInput.value);
  minWeightInput.value = minValue;
  maxWeightInput.value = maxValue;
}

function getValueBasic() {
  minValue = 0;
  maxValue = 1000;
  minWeightInput.value = minValue;
  maxWeightInput.value = maxValue;
}

function getWeightValue() {
  getStartValue();
  if (isNaN(minValue) || isNaN(maxValue) || minValue > maxValue) {
    getValueBasic();
  } else if (minValue > 1000 || maxValue > 1000) {
    getValueBasic();
  } else if (minValue < 0 || maxValue < 0) {
    getValueBasic();
  }
}

// фильтрация массива
function filterFruits() {
  getWeightValue(); // получаем значения мин. макс
  // получаем фильтрованный список в переменную (объявлена в самом начале)
  fruitsFiltered = fruits.filter(
    (item) => item.weight >= minValue && item.weight <= maxValue
  );
  // все работает, но не прибавляются элементы в списке, при уменьшении, а затем увеличении диапазона
  //fruits = fruitsFiltered;
  display(fruitsFiltered); // fruits, если хотим реализовать код выше
  count = 0; // сбрасываем счетчик кликов по кнопке перемешать
}
// кнопка фильтровать
filterBtn.addEventListener('click', filterFruits);

// ---- ПЕРЕМЕШИВАНИЕ -----

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// сравнение массивов
const compareArrays = (a, b) =>
  a.length === b.length && a.every((item, index) => item === b[index]);
// или const compareArray2 = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// --- функция ПЕРЕМЕШИВАНИЯ МАССИВА ----
function mixFruits() {
  // копируем текущий массив для дальнейшего сравнения с новым массивом
  let newFruits = fruits.slice();
  let fillingUpArray = []; // создали пустой массив, который будем наполнять
  while (fruits.length > 0) {
    // пока текущий массив не опустеет
    let randomElement = getRandomInt(0, fruits.length - 1); // случайное число (индекс элемента)
    let cutElement = fruits.splice(randomElement, 1); // вырезаем его из текущего массива
    fillingUpArray.push(cutElement[0]); // добавляем элемент в созданный массив
  }
  fruits = fillingUpArray; // копируем массив
  display(fruits); // отображаем миксованный массив
  // cравниваем элементы массивов, если равны, показываем сообщение
  count++; // счетчик кликов по кнопке перемешать
  if (compareArrays(fruits, newFruits) && fruits.length > 0) {
    // массивы равны
    popup.classList.add('popup-open'); // выводим сообщение на экран
    wrapper.style.zIndex = -1; // чтобы пользователь не смог взаимодейтсвовать с осн. контентом
    attempt.textContent = count; // текст в теге span равен = количеству кликов
    count = 0; // сбрасываем счетчик
  }
}

mixBtn.addEventListener('click', mixFruits); // кнопка перемешивания

// закрываем pop-up
document.addEventListener('click', (e) => {
  if (e.target.closest('.popup__close-btn') || e.target.closest('.popup__btn'))
    popup.classList.remove('popup-open');
  wrapper.style.zIndex = 2;
});

// ----- СОРТИРОВКА ----- //

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки
sortKindInput.textContent = sortKind;
sortTimeInput.textContent = sortTime;

// функции сравнения
function comparationColor(a, b) {
  const priority = [
    'красный',
    'оранжевый',
    'коричневый',
    'желтый',
    'зеленый',
    'голубой',
    'синий',
    'фиолетовый',
    'розовый',
    'серый',
    'черный',
    'белый',
  ];
  const priority1 = priority.indexOf(a.color);
  const priority2 = priority.indexOf(b.color);
  return priority1 > priority2;
}

function comparator(a, b) {
  const priority = [
    'красный',
    'оранжевый',
    'коричневый',
    'желтый',
    'зеленый',
    'голубой',
    'синий',
    'фиолетовый',
    'розовый',
    'серый',
    'черный',
    'белый',
  ];
  const priority1 = priority.indexOf(a.color);
  const priority2 = priority.indexOf(b.color);
  return priority1 < priority2 ? -1 : priority1 > priority2 ? 1 : 0;
}

const sortAPI = {
  // Пузырьковая сортировка
  bubbleSort(items, comparation) {
    // внешняя итерация по элементам
    for (let i = 0; i < items.length - 1; i++) {
      // внутренняя итерация для перестановки элемента в конец массива
      for (let j = 0; j < items.length - 1 - i; j++) {
        if (comparation(items[j], items[j + 1])) {
          // сравниваем элементы
          let temp = items[j + 1]; // делаем обмен элементов
          items[j + 1] = items[j];
          items[j] = temp;
        }
      }
    }
  },
  // Быстрая сортировка
  quickSort(items, comparation) {
    const recursiveSort = (left, right) => {
      if (right - left < 1) return;
      const pivot = items[right];
      let splitIndex = left;

      for (let i = left; i < right; i++) {
        if (comparation(items[i], pivot) === -1) {
          if (splitIndex !== i) {
            const temp = items[splitIndex];
            items[splitIndex] = items[i];
            items[i] = temp;
          }
          splitIndex++;
        }
      }
      items[right] = items[splitIndex];
      items[splitIndex] = pivot;
      recursiveSort(left, splitIndex - 1);
      recursiveSort(splitIndex + 1, right);
    };
    recursiveSort(0, items.length - 1);
  },
  // выполняет сортировку и производит замер времени
  startSort(sort, items, comparation) {
    const start = Date.now();
    sort(items, comparation);
    const end = Date.now();
    sortTime = `${end - start} ms`;
    count = 0; // сбрасываем счетчик для кнопки перемешать
  },
};

// смена алгоритма сортировки и текущий алгоритм записывается в поле «Алгоритм сортировки».
sortChangeBtn.addEventListener('click', () => {
  sortKind =
    sortKindInput.textContent === 'quickSort' ? 'bubbleSort' : 'quickSort';
  sortTimeInput.textContent = '-';
  sortKindInput.textContent = sortKind;
});
//  кнопка сортировать
sortActionBtn.addEventListener('click', () => {
  sortTimeInput.textContent = '-';
  const sort = sortAPI[sortKind];
  if (sortKind === 'bubbleSort') {
    sortAPI.startSort(sort, fruits, comparationColor);
  } else {
    sortAPI.startSort(sort, fruits, comparator);
  }
  display();
  sortTimeInput.textContent = sortTime;
});

// ---- ДОБАВИТЬ ФРУКТ ----- //

// необходимые значения берем из kindInput, colorInput, weightInput
let addedKind, addedColor, addedWeight;

// проверяем вводимые значения, преобразовываем их
function getValues() {
  addedKind = kindInput.value;
  if (addedKind.length > 0) {
    addedKind =
      addedKind[0].toUpperCase() + addedKind.slice(1).toLowerCase().trim();
  }

  addedColor = colorInput.value;
  const condition = colorInput.value.length > 2 && !isFinite(colorInput.value);
  addedColor = condition ? addedColor.toLowerCase().trim() : (addedColor = '');

  addedWeight = weightInput.value;
  addedWeight = addedWeight < 0 ? '' : parseInt(addedWeight);
  addedWeight = isNaN(addedWeight) ? '' : addedWeight;
}

// Кнопка добавить фрукт
addFruitBtn.addEventListener('click', () => {
  getValues();
  addNewFruits();
});

// закрываем pop-up 2
document.addEventListener('click', (e) => {
  if (
    e.target.closest('.popup-add-fruit__btn') ||
    e.target.closest('.popup-add-fruit__close-btn')
  ) {
    popupAddFruit.classList.remove('popup-add-fruit-open');
    wrapper.style.zIndex = 3;
  }
});

// ------------- ПРОЧЕЕ ---- ОФОРМЛЕНИЕ ------------
function setBorderColor() {
  // css классы
  let fruitsClassList = [
    'fruit_violet',
    'fruit_green',
    'fruit_carmazin',
    'fruit_yellow',
    'fruit_lightbrown',
    'fruit_orange',
    'fruit_cyan',
    'fruit_blue',
    'fruit_pink',
  ];
  let bgColor = colorField.textContent;
  // чтобы цвет рамки соответствовал названию цвета в поле color при добавлении и перемешивании фруктов
  if (bgColor.includes('фиол') || bgColor.includes('пурп')) {
    listItem.classList.add(fruitsClassList[0]);
  } else if (bgColor.includes('зел') || bgColor.includes('олив')) {
    listItem.classList.add(fruitsClassList[1]);
  } else if (bgColor.includes('крас') || bgColor.includes('бордо')) {
    listItem.classList.add(fruitsClassList[2]);
  } else if (bgColor.includes('жёл') || bgColor.includes('жел')) {
    listItem.classList.add(fruitsClassList[3]);
  } else if (bgColor.includes('кор') || bgColor.includes('беж')) {
    listItem.classList.add(fruitsClassList[4]);
  } else if (bgColor.includes('ора')) {
    listItem.classList.add(fruitsClassList[5]);
  } else if (bgColor.includes('гол') || bgColor.includes('бир')) {
    listItem.classList.add(fruitsClassList[6]);
  } else if (bgColor.includes('син') || bgColor.includes('инд')) {
    listItem.classList.add(fruitsClassList[7]);
  } else if (bgColor.includes('роз')) {
    listItem.classList.add(fruitsClassList[8]);
  }
}
