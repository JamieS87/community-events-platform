# Community Events Platform

[Online Demo](https://community-events-platform.vercel.app/)

This is a full-stack web application for listing free, paid and pay-as-you-feel events that can be purchased by users and added to their Google Calendar.

## Prerequisites

Before we can run the application locally, we will need to install some additional software.

### Install Docker Desktop

Download and install Docker Desktop by visiting [Get-Docker](https://docs.docker.com/get-docker/) and choosing the appropriate version for your operating system.

### Install Stripe CLI

Download and install the Stripe CLI by following the "Install The Stripe CLI" step listed [here](https://docs.stripe.com/stripe-cli#install)

### Install Git

Download and install Git by following the instructions listed [here](https://github.com/git-guides/install-git)

[Install Git On Windows](https://docs.docker.com/desktop/install/windows-install/#install-docker-desktop-on-windows)

[Install Git On Linux](https://docs.docker.com/desktop/install/windows-install/#install-docker-desktop-on-windows)

## Install The Project

To complete the following steps, we will need to type and run commands in a program known as a **Command Line**.

To open a command line on **Windows**, [follow these instructions](https://www.ionos.co.uk/digitalguide/server/tools/open-command-prompt/)

To open a command line on **Linux**, [follow these instructions](https://www.geeksforgeeks.org/how-to-open-terminal-in-linux/)

### Clone the repo

Type the following into the command line and press the Return (↵) key.

```console
git clone https://github.com/JamieS87/community-events-platform
```

### Change directory

Type the following into the command line and press the Return (↵) key.

```console
cd community-events-platform
```

### Install dependencies

Type the following into the command line and press the Return (↵) key.

```console
npm install
```

## Create Accounts

This project allows users to sign in using a Google account, and to add purchased events to their Google Calendar. For this reason, we need to create a **Google Cloud Platform** account.

### Google Cloud Platform

1. Visit [Google Cloud Platform](https://console.cloud.google.com/home/dashboard) and create a new project.

2. Configure the consent screen by going to the [Consent Screen Configuration Page](https://console.cloud.google.com/apis/credentials/consent)
3. On the Scopes page, add the non-sensitive scopes

   `.../auth/userinfo.email`

   `...auth/userinfo.profile`

4. On the Scopes page, add the sensitive scope

   `.../auth/calendar.events.owned.readonly`

5. Go to the [API Credentials Page](https://console.cloud.google.com/apis/credentials)

6. Click **Create credentials** and choose `OAuth Client ID`

7. Under **application type** choose `Web application`

8. Under **Authorized Javascript Origins** add `http://localhost:3000`

9. Under **Authorized redirect URIs** add `http://127.0.0.1:54321/auth/v1/callback`

10. When you've finished creating your credentials, you will be shown your **Client ID** and **Client Secret**. Add these to your `.env` file, as described in the [Environment Variables](#environment-variables) Section.

This project allows users to purchase events. In order to process payments, we need to create an account with a payment processor called Stripe.

### Stripe

1. Visit [Stripe](https://stripe.com) and create a new account.

2. Visit the [Test Dashboard](https://dashboard.stripe.com/test/dashboard)

3. Copy your secret key. This is the value of your `STRIPE_SECRET_KEY` [Environment Variable](#environment-variables)

## Environment Variables

In the community-events-platform directory, you will find a file named `.env.example`

Create a copy of this file with the filename `.env`

Open the `.env` file in a text editor, it should look like the following.

```text
SUPABASE_API_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your supabase anon key
SUPABASE_SERVICE_ROLE_KEY=your supabase service role key

GOOGLE_AUTH_CLIENT_ID=your google project's client id
GOOGLE_AUTH_CLIENT_SECRET=your google project's client secret

STRIPE_SECRET_KEY=your stripe secret key
STRIPE_WEBHOOK_SECRET=your stripe webhook secret

NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_API_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
NEXT_PUBLIC_OBJECT_STORAGE_URL=$SUPABASE_API_URL/storage/v1/object/public
```

### `GOOGLE_AUTH_CLIENT_ID` and `GOOGLE_AUTH_CLIENT_SECRET`

Get your Google Client ID and Google Client Secret by visiting the [Google Cloud Console](https://console.cloud.google.com/welcome) and following the steps in the screenshots below.

Click **APIs & Services**

![Google cloud console](/readme_assets/google-cloud-console.jpg)

Click **Credentials**

![Google cloud console dashboard](/readme_assets/google-cloud-console-dashboard.jpg)

Click the area highlighted by the red box

![Google cloud console dashboard oauth](/readme_assets/google-cloud-console-dashboard-oauth.jpg)

Copy the **Client ID** and **Client secret**

![Google cloud console dashboard oauth credentials](/readme_assets/google-cloud-console-dashboard-oauth-credentials.jpg)

Copy and paste the values into your `.env` file under the `GOOGLE_AUTH_CLIENT_ID` and `GOOGLE_AUTH_CLIENT_SECRET` variables.

**IMPORTANT:** The file needs to be saved before proceeding to the next step. When saving the file, ensure it is saved with the filename `.env`.

```text
SUPABASE_API_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=eyJhb_lots_more_anon_key_chars...
SUPABASE_SERVICE_ROLE_KEY=eyJhb_lots_more_service_role_key_chars...

GOOGLE_AUTH_CLIENT_ID=4314...apps.googleusercontent.com
GOOGLE_AUTH_CLIENT_SECRET=GQPFPX-FXB7e...

STRIPE_SECRET_KEY=your stripe secret key
STRIPE_WEBHOOK_SECRET=your stripe webhook secret

NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_API_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
NEXT_PUBLIC_OBJECT_STORAGE_URL=$SUPABASE_API_URL/storage/v1/object/public
```

_Note the lines `GOOGLE_AUTH_CLIENT_ID` and `GOOGLE_AUTH_CLIENT_SECRET` now contain the values from the blue boxes in the scereenshots above._

### `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`

Type the following into the command line and press the Return (↵) key.

```console
npx supabase start
```

_Note: if the above command doesn't show the example output, run:_ `npx supabase status` _instead._

When the command has finished running, you should see something similar to the following

```console
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhb_lots_more_anon_key_chars...
service_role key: eyJhb_lots_more_service_role_key_chars...
   S3 Access Key: 625...
   S3 Secret Key: 850...
       S3 Region: local
```

Copy and paste the values of `anon key` and `service_role key` from above to your `.env` file.

After copying and pasting, `.env` should look like this.

```text
SUPABASE_API_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=eyJhb_lots_more_anon_key_chars...
SUPABASE_SERVICE_ROLE_KEY=eyJhb_lots_more_service_role_key_chars...

GOOGLE_AUTH_CLIENT_ID=your google project's client id
GOOGLE_AUTH_CLIENT_SECRET=your google project's client secret

STRIPE_SECRET_KEY=your stripe secret key
STRIPE_WEBHOOK_SECRET=your stripe webhook secret

NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_API_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
NEXT_PUBLIC_OBJECT_STORAGE_URL=$SUPABASE_API_URL/storage/v1/object/public
```

_Note the lines `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` now contain the values from above._

### `STRIPE_SECRET_KEY`

Get your Stripe secret key by visiting [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard) and following the screenshots below.

Click the area in the red box to reveal your **Secret Key**

![Stripe Dashboard](/readme_assets/stripe-dashboard-secret-key.jpg)

Click the area in the blue box to copy your **Secret Key**

![Stripe Dashboard Secret Key Reveals](/readme_assets/stripe-dashboard-secret-key-revealed.jpg)

Paste the value into your `.env` file

```text
SUPABASE_API_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=eyJhb_lots_more_anon_key_chars...
SUPABASE_SERVICE_ROLE_KEY=eyJhb_lots_more_service_role_key_chars...

GOOGLE_AUTH_CLIENT_ID=your google project's client id
GOOGLE_AUTH_CLIENT_SECRET=your google project's client secret

STRIPE_SECRET_KEY=sk_test_51PVJ.............
STRIPE_WEBHOOK_SECRET=your stripe webhook secret

NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_API_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
NEXT_PUBLIC_OBJECT_STORAGE_URL=$SUPABASE_API_URL/storage/v1/object/public
```

_Note the line `STRIPE_SECRET_KEY` now contains the value from the blue box above._

### `STRIPE_WEBHOOK_SECRET`

Type the following into the command line and press the Return (↵) key.

```console
stripe login
```

Follow the instructions on the screen, making sure to click **Allow access** when prompted.

When finished, type the following into the command line and press the Return (↵) key.

```console
stripe listen --foward-to localhost:3000/webhooks
```

You should see output similar to the following.

```console
Your webhook signing secret is whsec_ed72fe_super_secret_key...
```

Press Ctrl-C to quit.

copy your webhook signing secret to your `.env` file

```text
SUPABASE_API_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=eyJhb_lots_more_anon_key_chars...
SUPABASE_SERVICE_ROLE_KEY=eyJhb_lots_more_service_role_key_chars...

GOOGLE_AUTH_CLIENT_ID=your google project's client id
GOOGLE_AUTH_CLIENT_SECRET=your google project's client secret

STRIPE_SECRET_KEY=sk_test_51PVJ.............
STRIPE_WEBHOOK_SECRET=whsec_ed72fe_super_secret_key...

NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_API_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
NEXT_PUBLIC_OBJECT_STORAGE_URL=$SUPABASE_API_URL/storage/v1/object/public
```

_Note the line `STRIPE_WEBHOOK_SECRET` now contains the value from above_

Make sure to save the changes you have made to your `.env` file.

## Build The Application

If this is your first time starting the application, run the command below

```console
npm run build
```

## Start The Stripe CLI

In a new Command Line window, type the following and press the Return (↵) key.

```console
stripe listen --forward-to localhost:3000/webhooks
```

## Start The Application

You've reached the final step!

Type the following into the command line and press the Return (↵) key.

```console
npm run start
```

Now visit [http://localhost:3000](http://localhost:3000) to see the application in action.

### Creating A Staff Account

To add events to the application, you must have a staff account.

To create a staff account, type and run the following into the command line, replacing **your_email_address** with the email address you'd like to use for the account, and **your_password** with the desired password for the account.

_Note: password must be at least 10 characters in length._

```console
npm run create-staff-user -- -e your_email_address -p your_password
```

Once you've created the account, visit [http://localhost:3000/login](http://localhost:3000/login) to log in to the account.

### Adding Events

If you don't already have a staff account, follow [these instructions](#creating-a-staff-account) and log in to the account.

Once logged in, the user menu will have an **Admin** item. Click **Admin** to be taken to the admin page.

alternatively, visit [http://localhost:3000/admin](http://localhost:3000/admin).

Once on the admin page, click **Add Event**.
