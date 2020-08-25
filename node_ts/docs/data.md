## Create User

**URL** : `api/v1/user`

**Method** : `POST`

**Header** : `application/json`

**Auth required** : None

**Permissions required** : None

## Request Body

```json
{
    "first_name": "Charles",
    "last_name": "groom",
    "email_address": "charles32@gmail.com",
    "phone_number": "8812754832",
    "amount_needed": "between_$30000_$44000",
    "time_in_business": "a_less_than_6_months",
    "annual_revenue": "between_$100000_$399999",
    "credit_score": "a_more_than_750"
}
```

## Success Response

**Code** : `201`

**Response**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "email_address": "charles32@gmail.com",
        "phone_number": 8812754832,
        "created_at": "2020-08-05T08:51:16.000Z",
        "updated_at": "2020-08-05T08:51:16.000Z",
        "id": "5f2a73046218790034ec11e3",
        "first_name": "Charles",
        "last_name": "groom",
        "amount_needed": "5e7b9c72e297260db8debdfc",
        "time_in_business": "5e7b9c70e297260db8debddc",
        "annual_revenue": "5e7b9c6ee297260db8debdc6",
        "credit_score": "5e7b9c72e297260db8debde6",
        "duplicate": true
    }
}
```

Note: It return key "duplicate" in response having value "true", if user already exist

## Invalid Response

**Code** : `400`

**Response**

```json
{
    "status": "error",
    "code": 400,
    "error": [
        {
            "type": "FIELD_REQUIRED",
            "message": "This action requires the field to be specified.",
            "parameter": "first_name"
        },
        {
            "type": "FIELD_REQUIRED",
            "message": "This action requires the field to be specified.",
            "parameter": "last_name"
        },
        {
            "type": "FIELD_INVALID",
            "message": "The value of the field is invalid.",
            "parameter": "email_address"
        }
    ]
}
```
Note: It check for validation before saving data and returns validation error if any

## Create Application
This will create application, save business and owner details

**URL** : `api/v1/application`

**Method** : `POST`

**Header** : `application/json`

**Auth required** : None

**Permissions required** : None

## Request Body

```json
{
    "user_id": "5f28e71e9e6581003bbfa9d5",
    "loan_amount": "45000",
    "loan_tenure": "28",
    "loan_purpose": "machine buy",
    "business_name": "hardware shop",
    "another_business_name": "hardware",
    "business_address": {
        "business_address": "street",
        "state": "newyork",
        "city": "hamilton",
        "zipcode": 110233,
        "country": "us"
    },
    "credit_card": [{
        "credit_card_processor": "bank1",
        "credit_card_value": 200000,
        "transaction_per_month": 10
    },
    {
        "credit_card_processor": "bank2",
        "credit_card_value": 300000,
        "transaction_per_month": 20
    }],
    "owners": [
        {
            "first_name": "Sunil",
            "last_name": "Kumar",
            "email_address": "sunilkew@sdg.fs",
            "job_title": "ceo",
            "home_address": {
                "home_address": "street",
                "zipcode": "943434",
                "state": "new york",
                "city": "hamilton",
                "country": "us"
            },
            "date_of_birth": "23-09-1997",
            "ssn": "5466",
            "monthly_income": "453453",
            "monthly_expense": "34000",
            "ownership": "100",
            "applicant_phone": "7645544554"
        }
    ]
}
```

## Success Response

**Code** : `200`

**Response**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "user_id": "5f28e71e9e6581003bbfa9d5",
        "app_id": "5f2c04b10a7dfd0028477745",
        "loan_amount": "45000",
        "loan_tenure": "28",
        "loan_purpose": "machine buy",
        "business_name": "hardware shop",
        "another_business_name": "hardware",
        "business_address": {
            "business_address": "street",
            "state": "newyork",
            "city": "hamilton",
            "zipcode": 110233,
            "country": "us"
        },
        "business_number": "",
        "business_structure": "",
        "business_incorporation_date": "",
        "about_to_start_business": "",
        "business_industry": "",
        "sub_industry": "",
        "business_annual_revenue": "",
        "operational_expenditures": "",
        "is_accept_credit_card": "",
        "credit_card": [
            {
                "credit_card_processor": "bank1",
                "credit_card_value": 200000,
                "transaction_per_month": 10
            },
            {
                "credit_card_processor": "bank2",
                "credit_card_value": 300000,
                "transaction_per_month": 20
            }
        ],
        "is_outstanding_debt": "",
        "outstanding": "",
        "created_at": "2020-08-06T13:25:07.000Z",
        "updated_at": "2020-08-06T13:25:07.000Z",
        "owners": [
            {
                "app_id": "5f2c04b10a7dfd0028477745",
                "user_id": "5f28e71e9e6581003bbfa9d5",
                "first_name": "Sunil",
                "last_name": "Kumar",
                "email_address": "sunilkew@sdg.fs",
                "job_title": "ceo",
                "home_address": {
                    "home_address": "street",
                    "zipcode": "943434",
                    "state": "new york",
                    "city": "hamilton",
                    "country": "us"
                },
                "date_of_birth": "23-09-1997",
                "ssn": "5466",
                "monthly_income": "453453",
                "monthly_expense": "34000",
                "ownership": "100",
                "applicant_phone": "7645544554",
                "created_at": "2020-08-06T13:25:08.000Z",
                "updated_at": "2020-08-06T13:25:08.000Z",
                "id": "5f2c04b40a7dfd0028477747"
            }
        ],
        "id": "5f2c04b352a4d3002fedde06"
    }
}
```
Note: It return key "duplicate" in response having value "true", if trying to create application again with same user_id

## Invalid Response

**Code** : `400`

**Response**

```json
{
    "status": "error",
    "code": 400,
    "error": [
        {
            "type": "FIELD_REQUIRED",
            "message": "This action requires the field to be specified.",
            "parameter": "loan_amount"
        },
        {
            "type": "FIELD_REQUIRED",
            "message": "This action requires the field to be specified.",
            "parameter": "credit_card.credit_card_processor"
        },
        {
            "type": "FIELD_REQUIRED",
            "message": "This action requires the field to be specified.",
            "parameter": "owners.job_title"
        },
        {
            "type": "FIELD_REQUIRED",
            "message": "This action requires the field to be specified.",
            "parameter": "owners.home_address.home_address"
        },
        {
            "type": "FIELD_REQUIRED",
            "message": "This action requires the field to be specified.",
            "parameter": "owners.home_address.zipcode"
        }
    ]
}
```
Note: It check for validation before saving data and returns validation error if any