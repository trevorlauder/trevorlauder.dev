---
title: Using RDS IAM authentication with DBeaver Community Edition (CE)
categories:
  - Blog
tags:
  - DBeaver
  - AWS
  - RDS
  - IAM
  - JDBC
  - MySQL
  - PostgreSQL
description: How to use DBeaver Community Edition (CE) with RDS IAM authentication
header:
  teaser: /assets/images/teasers/dbeaver-rds-iam.svg
  og_image: /assets/images/teasers/dbeaver-rds-iam.svg
image:
  path: /assets/images/teasers/dbeaver-rds-iam.svg
  width: 1200
  height: 630
---
While DBeaver Professional has IAM authentication support out of the box.  This post describes how you can accompish the same thing while using DBeaver CE.

# MySQL

You need to install the [AWS JDBC Driver for MySQL](https://github.com/awslabs/aws-mysql-jdbc) and the [AWS SDK for Java (RDS)](https://aws.amazon.com/sdk-for-java/) by doing the following:

- Open `Driver Manager` -> `New` and use the following settings:

  - **Driver Name**: AWS JDBC Driver for MySQL
  - **Class Name**: software.aws.rds.jdbc.mysql.Driver
  - **URL Template**: jdbc:mysql:aws://{host}:{port}
  - **Default Port**: 3306

  ![MySQL-Driver-Settings](/assets/images/2022-11-02-DBeaver-AWS-RDS-IAM-Authentication/MySQL-Driver-Settings.webp)

- Click on the `Libraries` tab -> `Add Artifact` and paste in the following:

  ```xml
  <!-- replacing LATEST with specific version as required -->

  <dependencies>
      <dependency>
          <groupId>software.aws.rds</groupId>
          <artifactId>aws-mysql-jdbc</artifactId>
          <version>LATEST</version>
      </dependency>
      <dependency>
          <groupId>software.amazon.awssdk</groupId>
          <artifactId>rds</artifactId>
          <version>LATEST</version>
      </dependency>
  </dependencies>
  ```

- Click `OK` and `Close` the Driver Manager
- [Continue below](#using-the-driver)

# PostgreSQL

You need to install the [AWS JDBC Driver](https://github.com/awslabs/aws-advanced-jdbc-wrapper), the [AWS SDK for Java (RDS)](https://aws.amazon.com/sdk-for-java/) and the [PostgreSQL JDBC Driver](https://github.com/pgjdbc/pgjdbc) by doing the following:

- Open `Driver Manager` -> `New` and use the following settings:

  - **Driver Name**: AWS JDBC Driver for PostgreSQL
  - **Class Name**: software.amazon.jdbc.Driver
  - **URL Template**: jdbc:aws-wrapper:postgresql://{host}:{port}/{database}
  - **Default Port**: 5432

  ![PostgreSQL-Driver-Settings](/assets/images/2022-11-02-DBeaver-AWS-RDS-IAM-Authentication/PostgreSQL-Driver-Settings.webp)

- Click on the `Libraries` tab -> `Add Artifact` and paste in the following:

  ```xml
  <!-- replacing LATEST with specific version as required -->

  <dependencies>
      <dependency>
          <groupId>software.amazon.awssdk</groupId>
          <artifactId>rds</artifactId>
          <version>LATEST</version>
      </dependency>
      <dependency>
          <groupId>software.amazon.jdbc</groupId>
          <artifactId>aws-advanced-jdbc-wrapper</artifactId>
          <version>LATEST</version>
      </dependency>
      <dependency>
          <groupId>org.postgresql</groupId>
          <artifactId>postgresql</artifactId>
          <version>LATEST</version>
      </dependency>
  </dependencies>
  ```

- Click `OK` and `Close` the Driver Manager
- [Continue below](#using-the-driver)

# Using the driver

- Completely exit DBeaver and re-open it from your terminal window.  This is needed so it loads your `AWS_PROFILE` environment variable.  You will need to remember to open DBeaver this way going forward to use the IAM credentials or find another way to load the environment variable on startup.  On macOS, I open the terminal and type the following to open DBeaver.  Set the profile name to be whatever your AWS profile is called, that has RDS IAM access.

  ```shell
  AWS_PROFILE="my profile" open /Applications/DBeaver.app
  ```
- Add a New Database Connection and use `AWS JDBC Driver for MySQL` or `AWS JDBC Driver for PostgreSQL` as the driver
- For MySQL: Click on the `Driver properties` tab, scroll down to `useAwsIam` and set it to `true`

  ![MySQL-Driver-Properties](/assets/images/2022-11-02-DBeaver-AWS-RDS-IAM-Authentication/MySQL-Driver-Properties.webp)
- For PostgreSQL: Click on the `Driver properties` tab, set `wrapperPlugins` to `iam`

  ![PostgreSQL-Driver-Properties](/assets/images/2022-11-02-DBeaver-AWS-RDS-IAM-Authentication/PostgreSQL-Driver-Properties.webp)
- Enter your DB connection details in the `Main` tab
  - Use your database username, [that was configured to use IAM auth](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html), and leave the password field blank
- Click `Test Connection` and it should connect and authenticate to your RDS database
