# VillanTV-backend
This repository contains the backend for the system used at Studentpuben Villan

A lightweight API server and Spotify wrapper that allows you to display the music you're currently listening to 🎸🎺.

### ⏪ Prerequisites
1. Create an application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
    - Click on the `Edit settings` button
    - Set the `Redirect URIs` to a convenient location <sup>_(doesn't matter)_</sup>
    - Save the given `Client ID` along with the `Client Secret`
2. Retrieve the access code
    - Visit the following URL after replacing `$CLIENT_ID`, `$SCOPE`, and `$REDIRECT_URI` 
    
        ```url
          https://accounts.spotify.com/authorize?response_type=code&client_id=$CLIENT_ID&scope=$SCOPE&redirect_uri=$REDIRECT_URI 
        ```
    - You can choose scope(s) by visiting the [Spotify API docs](https://developer.spotify.com/documentation/general/guides/authorization/scopes/)
3. Note `code` from the URL you were redirected to
4. Acquire your refresh token
    - Run the following CURL command
    
      ```ps
        curl -X POST https://accounts.spotify.com/api/token -d "client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&grant_type=authorization_code&code=$CODE&redirect_uri=$REDIRECT_URI"
      ```
    - Either replace or export the variables in your shell (`$CILENT_ID`, `$CLIENT_SECRET`, `$CODE`, and `$REDIRECT_URI`)
5. Save `refresh_token` for later, do this for both "users". 

## Installation

1. Clone the repository

2. Install dependencies

    ```ps
    npm install
    ```

3. Create a `.env` file in the root directory and add the refresh tokens from the previous spotify step

    ```env
    CLIENT_ID = "xxxxx"
    CLIENT_SECRET = "xxxx"
    REFRESH_TOKEN_ACC_1 = "xxxx"
    REFRESH_TOKEN_ACC_2 = "xxxx"
    ```

4. Run the server

    ```ps
    node server.js
    ``` 
