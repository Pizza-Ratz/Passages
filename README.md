# Passages
[![Coverage Status](https://coveralls.io/repos/github/Pizza-Ratz/Passages/badge.svg)](https://coveralls.io/github/Pizza-Ratz/Passages)


## CI/CD

We've set up some automation to help ourselves build a better product.

### Continuous Integration

[CircleCI](https://circleci.com) runs our test suite whenever a PR is created or commits are made to a branch that has an open PR on it.
PRs that have failing tests will be blocked from being merged. For more information, see the [CircleCI Readme](./.circleci/README.md).

### Test Coverage Reporting

To see how good a job our tests are doing of covering our code, visit [https://coveralls.io/github/Pizza-Ratz/Passages]

### Continuous Deployment

Google Cloud Build is used to automate the building and deploying of code that's committed to the `main` branch into the [staging environment](https://staging.mta-music.nyc).