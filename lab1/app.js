const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const PORT = 3000;

// Мок-дані міст
const cities = [
  {
    slug: 'zhytomyr',
    name: 'Житомир',
    temperature: 18,
    humidity: 65,
    pressure: 755
  },
  {
    slug: 'kyiv',
    name: 'Київ',
    temperature: 21,
    humidity: 58,
    pressure: 762
  },
  {
    slug: 'poltava',
    name: 'Полтава',
    temperature: 23,
    humidity: 52,
    pressure: 760
  },
  {
    slug: 'sumy',
    name: 'Суми',
    temperature: 20,
    humidity: 61,
    pressure: 758
  }
];

// Налаштування шаблонізатора hbs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Helper для порівняння значень у шаблонах
hbs.registerHelper('eq', (a, b) => a === b);

// Статичні файли (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут: головна сторінка
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Головна',
    firstCitySlug: cities[0].slug
  });
});

// Маршрут: погода для конкретного міста
app.get('/weather/:city', (req, res) => {
  const citySlug = req.params.city.toLowerCase();
  const city = cities.find(c => c.slug === citySlug);

  if (!city) {
    return res.status(404).render('404', { title: '404 - Не знайдено' });
  }

  res.render('weather', {
    title: `Погода — ${city.name}`,
    cities: cities,
    selectedCity: city
  });
});

// 404 для всіх інших маршрутів
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Не знайдено' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});
