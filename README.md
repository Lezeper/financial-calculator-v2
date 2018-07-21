# Financial Calculator
This project is implemented for my personal demand of financial forecast. It's important to give a hands-up before getting into the financial trouble. I'm a big fan of financial management and investment, so I heavily rely on this calculator to predict and control my daily spending for achiving financial gold.
## Main Features
    * Mimic pending transaction process by given pending day.
    * Allow Credit Card use ARP 0 offer to pay the minimum payment only.
    * Automatically paying the credit card statement balance.
    * Showing the lowest balance of each Checking/Savings account in period.
    * Showing each payment/transaction activity as report.
    * ...
## Main Library
    React
    Semantic UI
    Express
    moment
    typegoose
    typescript
## REST Api (/rest)
    GET     /predict?endDate&forceCalAll
    GET     /accounts
    POST    /account
    PUT     /account
    DELETE  /account/:id
    GET     /transactions
    POST    /transaction
    PUT     /transaction
    DELETE  /transaction/:id
    GET     /recurrings
    POST    /recurring
    PUT     /recurring
    DELETE  /recurring/:id