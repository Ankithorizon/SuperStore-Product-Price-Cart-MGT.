# Super-Store Product/Price/Cart MGT.

# DotNet Core API + React JS

Technology
----------
- .Net Core Web API

- XUnit - Unit Test

- EF Core - Code First - EF Transaction

- Repository pattern

- Sql Server

- Custom JWT Authentication

- React JS, Html, CSS, Javascript, Bootstrap, Google chart api


## Database

![DB Diagram](https://user-images.githubusercontent.com/26190114/138001679-781fc487-2e7c-446f-ab8d-9a9be3e48db1.PNG)


## System Diagram->

![System Dia drawio](https://user-images.githubusercontent.com/26190114/142509333-706c9f3d-9a86-4f5c-946b-2dabe32a8f11.png)


### ---> exceptions handling

	  - Model validations are handled on Client side - React - Component
	  - all Server side exceptions are handled on Api - Controller / C# Service
    
### ---> [Role based Authentication]

	- JWT Authentication
	- after successful login, respective Role is returned in Token / Response
	- React stores Role info with Token
	- Menu displays as per Role info
	
	
### ---> [register]

	- User can register with valid Username, Password, Email and Role [Admin/Manager/CSUser]
	- after successful registration, user is redirected to login page
	- after un-successful register, error message is displayed 


### ---> [login]

	- User can login with valid Username and Password
	- after successful login, Token, Role and other User's information is stored
		on Client side and menu options are displayed as per User's Role and redirects to Home page
	- after un-successful sign-in, error message is displayed 
    
### ---> Admin : Role

	- User can add / edit / view Product
	- User can add Product with Image upload
	- User can edit Product with Image edit and upload 
	
### ---> Manager : Role

	- User can view Product
	- User can set Discount on Product 
	- User can View Text Report on
		- [Monthly]-Product-Wise
   		- [Monthly]-Store-Wise
   		- Selected Product-Month-Wise
	- User can View Chart (google chart api) Report on
		- Product-Discount-Wise
   		- [Monthly]-Product-Wise
   		- [Monthly]-Store-Wise
	
### ---> CSUser : Role

	- User can view Product
	- User can filter Product by Product-Name, Product-Description and Product-Category
	- User can shop Product by adding Products and Product-Quantity to Shopping-Cart
	- User can edit Shopping-Cart
	- User can do Payment by either Cash or Credit-Card
	- User can View Payment-Receipt after successful Payment
	
	
# Screens->

## Home->

![Home](https://user-images.githubusercontent.com/26190114/142500848-883e94b7-737b-4d2c-9dd6-bab470ffa36f.PNG)


## Register->

![Register-1](https://user-images.githubusercontent.com/26190114/142500871-2f0342e6-6191-47e6-abc8-07a134f5fff2.PNG)

![Register-2](https://user-images.githubusercontent.com/26190114/142500883-a5378e73-0cf3-4095-b4eb-d41c2d487724.PNG)


## Login->

![Login-1](https://user-images.githubusercontent.com/26190114/142500935-5e77b8df-51ff-46aa-b451-1c0b55422be6.PNG)

![Login-2](https://user-images.githubusercontent.com/26190114/142500947-574ed3fe-52c8-4731-a73a-0e6d9043f57e.PNG)

![Login-3](https://user-images.githubusercontent.com/26190114/142500962-c10000bd-815c-4439-b4d9-e3bd4ff668c8.PNG)

![Login-4](https://user-images.githubusercontent.com/26190114/142500978-16999447-6b44-4d49-9e3a-e549b78e1294.PNG)


## [Role:Admin] Add Product->

![Add Product-1](https://user-images.githubusercontent.com/26190114/142501016-00df45a5-3341-4520-939e-0b37d8a694eb.PNG)

![Add Product-2](https://user-images.githubusercontent.com/26190114/142501020-dc4677dc-0e12-4d3e-9a83-361f87c44ce2.PNG)

![Add Product-3](https://user-images.githubusercontent.com/26190114/142501026-67ad3e84-ef74-4540-98c2-03e0a5de9bb9.PNG)

![Add Product-4](https://user-images.githubusercontent.com/26190114/142501038-f6da9604-92e9-4485-9e2a-18e4877d944b.PNG)

## [Role:Admin] View / Search Product->

![View Product-1](https://user-images.githubusercontent.com/26190114/142501126-013fe00a-2898-4c0b-8d01-d3c07b7b06ca.PNG)

![Search Product-1](https://user-images.githubusercontent.com/26190114/142501147-6d82a842-2f58-4c9d-a4ee-b4482d3c5bce.PNG)

![View Product Details](https://user-images.githubusercontent.com/26190114/142501161-c6240770-d141-4c76-ab9d-69777aed7376.PNG)


## [Role:Admin] Edit Product->

![Edit Product-1](https://user-images.githubusercontent.com/26190114/142501230-271fc9ae-0da2-45c5-82f4-d1b442c5205f.PNG)

![Edit Product-2](https://user-images.githubusercontent.com/26190114/142501248-4fdb614d-af49-4615-ae74-074ba226aa37.PNG)

![Edit Product-3](https://user-images.githubusercontent.com/26190114/142501271-a125354f-f90f-43cf-ad49-1bbeae115e35.PNG)

![Edit Product-4](https://user-images.githubusercontent.com/26190114/142501280-99d55d61-cf86-4149-afbb-926ebb481920.PNG)

![Edit Product-5](https://user-images.githubusercontent.com/26190114/142501289-85c03a35-8d25-4306-b508-ef4fb867a6e2.PNG)


## [Role:Admin] File Upload / Download->

![File UpDown-1](https://user-images.githubusercontent.com/26190114/142501332-897c05db-9be1-458a-9b22-34e5870fc521.PNG)

![File UpDown-2](https://user-images.githubusercontent.com/26190114/142501342-04fccd0e-2b6a-4d21-be85-6930a645b949.PNG)


## [Role:Manager] Set-Product-Discount->

![Manager](https://user-images.githubusercontent.com/26190114/142501521-afa3c4a2-0ce0-4ad2-bcdd-12350b247d85.PNG)

![Set-Discount-1](https://user-images.githubusercontent.com/26190114/142501638-89ca8fd1-979f-4d94-9fea-8b8b1baf0a64.PNG)

![Set-Discount-2](https://user-images.githubusercontent.com/26190114/142501648-6e374043-5843-48bf-bc98-3aa92666a3df.PNG)

![Set-Discount-3](https://user-images.githubusercontent.com/26190114/142501660-b256047e-205c-4ca1-b0dd-db9ff87336b5.PNG)


## [Role:Manager] Text-Report->

![Text-Report-1](https://user-images.githubusercontent.com/26190114/142501793-c5107668-9670-4890-8243-32d0fa8da3f4.PNG)

![Text-Report-2](https://user-images.githubusercontent.com/26190114/142501813-f06c29b9-0150-4d59-9e54-6f06c91beec4.PNG)

![Text-Report-3](https://user-images.githubusercontent.com/26190114/142501820-c30dcbc4-b6c3-4bda-b64e-5b5d9a6f5de2.PNG)

![Text-Report-4](https://user-images.githubusercontent.com/26190114/142501824-bd0e0e64-0127-4e49-b1a9-8dd10898914b.PNG)


## [Role:Manager] Chart-Report->

![Chart-Report-1](https://user-images.githubusercontent.com/26190114/142501856-880ddbf3-38bc-4a32-87b3-2ce72f9f9eb4.PNG)

![Chart-Report-2](https://user-images.githubusercontent.com/26190114/142501868-eb823846-e428-4650-a209-98d957bc35a9.PNG)

![Chart-Report-3](https://user-images.githubusercontent.com/26190114/142501875-0c684fc0-358a-4bd5-9d08-d4e58cccae99.PNG)

![Chart-Report-4](https://user-images.githubusercontent.com/26190114/142501880-06f97caa-5a88-4b90-880e-ed5c59205fd5.PNG)


## [Role:CSUser] Shopping->

![CSUser](https://user-images.githubusercontent.com/26190114/142501979-f9dffebd-c163-47ff-b76d-2c0608374171.PNG)

![Shopping-1](https://user-images.githubusercontent.com/26190114/142501997-b596252c-5773-4ea7-b15f-605258b4de7b.PNG)

![Shopping-2](https://user-images.githubusercontent.com/26190114/142502003-82928666-379d-4878-bb5a-8d77b85e196e.PNG)

![Shopping-3](https://user-images.githubusercontent.com/26190114/142502016-40e219db-d971-411c-814e-be6fb8ce0d0c.PNG)

![Shopping-4](https://user-images.githubusercontent.com/26190114/142502030-e06dd2f8-b4b2-46ce-9ecf-dfec5330a68f.PNG)

![Shopping-5](https://user-images.githubusercontent.com/26190114/142502037-84cbf095-1d0f-4654-974e-b06a29f5be3b.PNG)

![Shopping-6](https://user-images.githubusercontent.com/26190114/142502053-522b299a-748f-43ca-8360-9558787e04b4.PNG)


## [Role:CSUser] Payment-CreditCard->

![Payment-CC-1](https://user-images.githubusercontent.com/26190114/142502172-e9589c02-d189-460b-a80e-2c16319febfe.PNG)

![Payment-CC-2](https://user-images.githubusercontent.com/26190114/142502186-06fd2a79-892e-49b9-8e06-6d09956858c5.PNG)


## [Role:CSUser] Payment-Cash->

![Payment-Cash-1](https://user-images.githubusercontent.com/26190114/142502235-5e2b3184-cfdb-4d0c-8edd-ceac516e58e9.PNG)

![Payment-Cash-2](https://user-images.githubusercontent.com/26190114/142502242-32487b5e-1903-4c0c-bffe-ccf1030a4eb0.PNG)









