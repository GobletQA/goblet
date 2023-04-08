# Gitlab Authentication
* Due to how Gitlab handles OAuth, an application must be configured **before** logging via Gitlab
* This is done in the [oauth/applications section of gitlab.com](https://gitlab.com/oauth/applications) or a hosted version of Gitlab

## Configuration Steps

* Configure your GitLab account by registering an application in gitlab
* Next, create a credential record for the GitLab App provider.

### Configure GitLab as an OAuth 2.0
* For more information, see [GitLab documentation](https://docs.gitlab.com/ee/integration/oauth_provider.html)

**Steps**
* From your GitLab account, create your Application by navigating to Edit Profile > Applications
* In the Add new application form
  * Specify a **Name**, and in Redirect URI field enter
    * `https://dev.gobletqa.app`
* In the Scopes section, ensure that you select the following check boxes:
  * `api`
  * `email`
  * `openid`
* Leave the remaining fields empty (default).
* Click Save application
* The application should now be created.
* Note down the `Application ID` and `Secret`
  * This will be used later in Goblet


### Issues
* **TODO** - Figure out way to get the application client ID before initializing gitlab provider on frontend?
* Probably need to use a PAT
  * See here => [https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
  * And here => [https://repository.prace-ri.eu/git/help/user/profile/personal_access_tokens.md](https://repository.prace-ri.eu/git/help/user/profile/personal_access_tokens.md)
    * Helper to prefill the PAT form on Gitlab => https://gitlab.example.com/-/profile/personal_access_tokens?name=Example+Access+token&scopes=api,read_user,read_registry
      * Which means these will need to be stored somewhere, maybe firebase?


