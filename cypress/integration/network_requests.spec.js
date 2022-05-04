/// <reference types="cypress" />

context('Network Requests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('cy.request() - can make an XHR request', () => {
    cy.request('https://jsonplaceholder.cypress.io/comments')
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('length').and.be.oneOf([500, 501])
        expect(response).to.have.property('headers')
        expect(response).to.have.property('duration')
      })
  })

  it('cy.request() - can pass result to the second request', () => {
    cy.request('https://jsonplaceholder.cypress.io/users?_limit=1')
      .its('body.0')
      .then((user) => {
        expect(user).property('id').to.be.a('number')
        cy.request('POST', 'https://jsonplaceholder.cypress.io/posts', {
          userId: user.id,
          title: 'Cypress Test Runner',
          body: 'Fast, easy and reliable testing for anything that runs in a browser.',
        })
      })
      .then((response) => {
        expect(response).property('status').to.equal(201)
        expect(response).property('body').to.contain({
          title: 'Cypress Test Runner',
        })
        expect(response.body).property('id').to.be.a('number')
          .and.to.be.gt(100)
        expect(response.body).property('userId').to.be.a('number')
      })
  })

  it('cy.intercept() - route responses to matching requests', () => {
    let message = 'whoa, this comment does not exist'

    cy.intercept('GET', '**/comments/*').as('getComment')
    cy.get('.network-btn').click()
    cy.wait('@getComment').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.intercept('POST', '**/comments').as('postComment')

    cy.get('.network-post').click()
    cy.wait('@postComment').should(({ request, response }) => {
      expect(request.body).to.include('email')
      expect(request.headers).to.have.property('content-type')
      expect(response && response.body).to.have.property('name', 'Using POST in cy.intercept()')
    })

    cy.intercept({
      method: 'PUT',
      url: '**/comments/*',
    }, {
      statusCode: 404,
      body: { error: message },
      headers: { 'access-control-allow-origin': '*' },
      delayMs: 500,
    }).as('putComment')
    cy.get('.network-put').click()
    cy.wait('@putComment')
    cy.get('.network-put-comment').should('contain', message)
  })
})
