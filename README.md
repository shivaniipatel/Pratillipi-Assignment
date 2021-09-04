
Case -

In our platform, users can subscribe to authors by paying a small amount and gain access to premium features like early access etc.
As we have more than 2.5lakh authors and we have to give a fair chance for authors to reach to more users and subscribers, we mark authors as eligible for subscription by two factors

    Popularity, based on how many followers does an author has.

    How active, how frequently the author is publishing the contents.

In a micro services architecture system, the data points follow, content published information is spread across different services.

Deciding factors and thresholds:
    Popularity: 200 followers
    Active: At least two contents published in the last one month.

Build a system to automatically mark authors as eligible for subscriptions, based on these 2 factors.


1. What is required out of the task? HLD? LLD? DB model?
    We would like to see a hosted and functional solution, also code to be shared via git/(similar).
2. Are there any given services that are to be used? as in followers is a seperate micro service and maybe content publishing is a separate micro service?
    You can build a simple webservice exposing two API's to stimulate publish and follow actions, so it becomes easy to test by hitting api to make an author eligible
3. Is 200 followers the lower limit of what an author should have to be eligible for subscription?
    That number must be configurable, for example, we can reduce the caps to 2hrs and 10 follewers+1 publish to test
4. Does the eligibility for premium subscription get revoked if the author's followers count changes from say 201 subscribers to 198 subscribers?
    Yes
5. Does the eligibility for premium subscription get revoked if the author fails to publish 2 articles in the last month?   
    Yes
6. Is the month here the fixed calendar month(like 2 articles in march) or the month window resets after the author publishes his/her article (say last article was published on 15th july so between 15th july and 15th august there should be two articles published)?
    Rolling window.
7. Once the eligibility is revoked, subscribers will continue to benefit the premium features from the author until the duration is expired?

Also consider how we can add and view an author and her eligibility status.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------


- Modules 
    - Users (authors, users )
        - add user 
            - {type : 'author/users', name: '', emailid: '', phome: , password:  }
            - hash password 
        - view author by id  
            - author details 
            - eligible for premium 
            - followers count 
            - total published articles 
            - articles published in the capped time 
            - no. of active premium users 
        - update eligiblity blindly by author ids [service]
            - {not_eligible : [], elgible: []}
    - followers  ( user_author_mapping/followers  )
        - unfollow/follow an author
            - update db mappings 
            - send event to update premium eligibility  
        - get followers count by author id [service]
        - get followers list by author id  [optional]
        - get following list by user id [optional]
    - articles (articles, author_articles_mapping(nr) )
        - add/delete an article 
            - update db mappings 
            - send event to update premium eligibility  
    - premium subscription  (premium_packages, author_subscribers_mapping/subscribers )
        - update followers/publishing time/published articles cap 
            - update all authors' eligibility based on new cap 
        - update all authors eligibility flag [---cron]
        - get premium eligibility by author id  [service]
        - update author's eligibility by authorid  [service]
        - get list of users eligible for premium subscription [optional]
            - pagination 
            - order by followers, latest published/more published  



- DB model 
    - authors [name, email_id(unique), phone, eligible_for_premium(default false), nth_article_published_at(timestamp), is_active, created_at, updated_at]
    - users [name, email_id(unique), phone, is_active, created_at, updated_at ]
    - followers [author_id, user_id, is_active, created_at, updated_at ]
    - articles [ author_id, name, description, content(text), filename(with entire path, maybe s3), is_active, created_at, updated_at  ]
    - premium_packages [no_of_days, price, description, is_active, created_at, updated_at]
    - subscribers [author_id, user_id, premium_package_id, start_date, end_date, is_active, created_at, updated_at ]

- Out of scope 
    - authO 
    - authentication
    - authors cannot follow fellow author 
    - test suite 


----
 
 API Documentation 
 
 - Add Author
    - Adds a new user to the system, with the premium subscription eligibility defaulted to false 
        
            curl --location --request POST '13.126.33.195:8080/pratilipi/user/author' \
            --header 'Content-Type: application/json' \
            --data-raw '{
                "name": "Shivani Patel",
                "emailid": "patelshivani@gmail.com",
                "phone":  4386439976
            }'


- Get author by ID  
    - last param is the author id 
    - The api returns the user details along with 
        - the flag to indicate whether or not the user is eligible for premium subscription 
        - Followers count 
        - Last 3 published articles 

                curl --location --request GET '13.126.33.195:8080/pratilipi/user/author/4'


- Update Authors Subscription  
    - Cron to update all authors premium subscription eligibility. 
    - The cron runs every minute
        
            curl --location --request PUT '13.126.33.195:8080/pratilipi/subscription/premiumSubscription'


- Update Subscription threshold 
    - Keys in body : 
        - required followers count(FC) [currently set to 2 ]
        - required published article(MPC),  [currently set to 2 ]
        - required time cap in hours (PTW)  [currently set to 10 hours ]
    - Updating any of the key will update the threshold for the authors as well as set the eligibility for premium subscription as per the new constraint
 
            curl --location --request PUT '13.126.33.195:8080/pratilipi/subscription/threshold' \
                --header 'Content-Type: application/json' \
                --data-raw '{
                    "constraints" : [
                        {"code": "FC", "threshold": 3},
                         {"code": "MPC", "threshold": 2},
                          {"code": "PTW", "threshold": 11}
                    ]
            }'


- Add Article 
    - Adds a new article against the author id (valid author ids 1-4)
    - This internally updates the eligibility of the author for premium subscription
            
            curl --location --request POST '13.126.33.195:8080/pratilipi/article' \
            --header 'Content-Type: application/json' \
            --data-raw '{
                "authorid": 4,
                "title": "dwihdi Sefjdb dis ds",
                "description": "dsgd dnoishdx djsiu bidgsdb",
                "content": "dasbjduyghao scnd isidzgvsdg ihds"
            }'


- Follow Author 
    - User can follow the author 
    - Valid user ids → 1 to 8 
    - Valid author ids → 1 to 4
    - This internally updates the eligibility of the author for premium subscription

            curl --location --request PUT '13.126.33.195:8080/pratilipi/follower/follow' \
            --header 'Content-Type: application/json' \
            --data-raw '{
                "authorid": 4,
                "userid": 4
            }'


- Unfollow Author 
    - User can unfollow the author 
    - This internally updates the eligibility of the author for premium subscription

            curl --location --request PUT '13.126.33.195:8080/pratilipi/follower/unfollow' \
                --header 'Content-Type: application/json' \
                --data-raw '{
                    "authorid": 4,
                    "userid": 6
                }'




