/// <reference types="cypress" />

Cypress.on('uncaught:exception', () => {
  return false;
});

describe('Конструктор бургеров с моками', () => {
  const user = {
    email: 'test@example.com',
    name: 'Test User'
  };

  beforeEach(() => {
    //Убираем webpack overlay
    cy.window().then((win) => {
      const overlay = win.document.getElementById('webpack-dev-server-client-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
    });

    //Мок ингредиентов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');

    //Мок пользователя
    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      body: { success: true, user }
    }).as('getUser');

    //Мок создания заказа
    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Space burger',
        order: { number: 12345 }
      }
    }).as('createOrder');

    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("Главная страница показывает ингредиенты", () => {
    cy.get("[data-cy=ingredient-card]").should("have.length", 2);
    cy.get("[data-cy=ingredient-card]").first().should("contain.text", "Краторная булка N-200i");
    cy.get("[data-cy=ingredient-card]").last().should("contain.text", "Биокотлета из марсианской Магнолии");
  });
  
  it("Добавление ингредиентов в конструктор через кнопку", () => {
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');

    cy.get("[data-cy=ingredient-card]").first().find('button').first().click({ force: true });
    cy.wait(300);
    cy.contains('Выберите булки').should('not.exist');
    cy.contains('Краторная булка').should('exist');

    cy.get("[data-cy=ingredient-card]").last().find('button').first().click({ force: true });
    cy.wait(300);
    cy.contains('Выберите начинку').should('not.exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');

    cy.get('button').contains('Оформить заказ').should('not.be.disabled');
  });

  it("Создание заказа с редиректом на логин для неавторизованного пользователя", () => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.get("[data-cy=ingredient-card]").first().find('button').first().click({ force: true });
    cy.get("[data-cy=ingredient-card]").last().find('button').first().click({ force: true });
    cy.wait(500);

    cy.get('button').contains('Оформить заказ').click({ force: true });
    cy.url().should('include', '/login');
    cy.get('input[name=email]').should('exist');
    cy.get('input[name=password]').should('exist');
  });

  it("Полный процесс создания заказа для авторизованного пользователя", () => {
  cy.visit('http://localhost:4000/login');
  
  cy.intercept('POST', 'api/auth/login', {
    statusCode: 200,
    body: {
      success: true,
      user: { email: 'test@example.com', name: 'Test User' },
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    }
  }).as('login');

  cy.get('input[name=email]').type('test@example.com');
  cy.get('input[name=password]').type('password123');
  cy.get('button').contains('Войти').click();

  cy.wait('@login');
  cy.url().should('include', '/profile');

  cy.visit('http://localhost:4000/');
  cy.wait('@getIngredients');

  //Добавляем ингредиенты
  cy.get("[data-cy=ingredient-card]").first().find('button').first().click({ force: true });
  cy.get("[data-cy=ingredient-card]").last().find('button').first().click({ force: true });
  cy.wait(500);

  //Запоминаем состояние конструктора ДО заказа
  cy.get('body').then(($body) => {
    const hasBun = !$body.text().includes('Выберите булки');
    const hasFilling = !$body.text().includes('Выберите начинку');
    
    //Нажимаем кнопку заказа
    cy.get('button').contains('Оформить заказ').click({ force: true });

    //Проверяем отправку запроса
    cy.wait('@createOrder', { timeout: 10000 });

    //Проверяем модальное окно заказа
    cy.get('[data-cy=order-modal]').should('be.visible');
    cy.get('[data-cy=order-number]').should('contain.text', '12345');

    //Закрываем модальное окно
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=order-modal]').should('not.exist');

    cy.wait(1000);
    
    //Проверяем очистку конструктора - должны вернуться сообщения "Выберите..."
    if (hasBun) {
      cy.contains('Выберите булки').should('exist');
    }
    if (hasFilling) {
      cy.contains('Выберите начинку').should('exist');
    }
    
    //Дополнительная проверка - не должно быть ингредиентов
    cy.get('[data-cy=constructor-filling-item]').should('not.exist');
  });
});

  it("Тест авторизации с редиректом на профиль", () => {
    cy.visit('http://localhost:4000/login');
    
    cy.intercept('POST', 'api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        user: { email: 'test@example.com', name: 'Test User' },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      }
    }).as('login');

    cy.get('input[name=email]').type('test@example.com');
    cy.get('input[name=password]').type('password123');
    cy.get('button').contains('Войти').click();
    
    cy.wait('@login');
    cy.url().should('eq', 'http://localhost:4000/profile');
  });

  it("Проверка работы с токенами авторизации", () => {
    cy.visit('http://localhost:4000/login');
    
    cy.intercept('POST', 'api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        user: { email: 'test@example.com', name: 'Test User' },
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token'
      }
    }).as('login');
    
    cy.get('input[name=email]').type('test@example.com');
    cy.get('input[name=password]').type('password123');
    cy.get('button').contains('Войти').click();
    
    cy.wait('@login').then(() => {
      cy.getCookie('accessToken').should('have.property', 'value', 'test-access-token');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('refreshToken')).to.eq('test-refresh-token');
      });
    });
  });
});