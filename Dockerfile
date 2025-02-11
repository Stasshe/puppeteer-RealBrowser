#FROM selenium/standalone-chrome

# Dockerfile for Selenium Grid Hub
FROM selenium/hub
EXPOSE 4444


# Dockerfile for Selenium Node Chrome
FROM selenium/node-chrome
EXPOSE 5555
