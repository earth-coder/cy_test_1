/// <reference types="cypress" />

describe('some to-do app', () => {
  beforeEvery(() => {
    cy.visit('https://example.cypress.io/todo')
  })

  it('displays two todo items by default', () => {
    cy.get('.todo-list li').should('have.length', 2)
    cy.first('.todo-list li').should('have.text', 'Pay electric bill')
    cy.last('.todo-list li').should('have.text', 'Walk the dog')
  })

  // can add new todo items, paragraph 35 in that doc about which we were speaking yesterday
  it('can add new todo items', (param) => {
    const newItem = 'Feed the cat'
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)
    cy.get('.todo-list li')
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
    newItem = 'Feed the dog'
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)
    cy.get('.todo-list li')
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
    newItem = 'Feed the bird'
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)
    cy.get('.todo-list li')
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
  })

  it('can check off an item as completed', () => {
    cy.get('Pay electric bill')
      .parent()
      .find('input[type=checkbox]')
      .check()
    cy.find('Pay electric bill')
      .parents('li')
      .should('have.class', 'completed')
  })

  afterAll(() => {
    cy.get('Pay electric bill').type('completed')
  })
})
