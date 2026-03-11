# Frontend Guide

## 🛠 Частина 1: Середовище та налаштування (Environment & Setup)

### 1. Встановіть Node.js

Переконайтеся, що у вас встановлена **Node.js версії 22 або новіша (LTS)**.

Завантажити можна тут:  
<https://nodejs.org>

### 2. Встановіть Angular CLI

Angular CLI — це інструмент командного рядка для створення та запуску Angular-проєктів.

```bash
npm install -g @angular/cli
```

### 3. Клонуйте репозиторій

1. Перейдіть у термінал.
2. Перейдіть у папку, де бажаєте встановити репозиторій.
3. У терміналі введіть подану команду:

    ```bash
    git clone https://github.com/AyTee001/growco.git
    ```

4. Після цього відкрийте папку репозиторію (growco) у VS Code.

### 4. Встановіть залежності проєкту

Всередині папки проєкту (growco) виконайте:

```bash
npm install
```

### 5. Встановіть Angular Language Service (VS Code)

1. Відкрийте Visual Studio Code
2. Перейдіть у вкладку Extensions (Ctrl + Shift + X)
3. У полі пошуку введіть: "Angular Language Service"
4. Встановіть розширення, опубліковане командою Angular

## Частина 2: 💻 Основні команди Angular CLI

### Виконання

#### Запуск проєкту (Development Server)

```bash
ng serve
```

#### Збірка проєкту (Build)

```bash
ng build
```

### Створення елементів Angular

Пропускаємо тести з опцією --skip-tests. Якщо не використати цю опцію і CLI згенерує файл some-name.spec.ts, його можна видалити.

#### Компоненти — основні будівельні блоки в Angular

```bash
ng generate component component-name --skip-tests
```

Коротка версія команди:

```bash
ng g c component-name --skip-tests
```

#### Сервіси – використовуються для складної логіки, роботи з API, спільної логіки між компонентами

```bash
ng generate service service-name --skip-tests
```

Коротка версія команди:

```bash
ng g s service-name --skip-tests
```

Є **інші види елементів**, не тільки сервіси та компоненти, але ці найважливіші
