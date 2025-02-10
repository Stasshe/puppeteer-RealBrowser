from selenium import webdriver
from selenium.webdriver.chrome.options import Options


chrome_options = Options()
# chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument("start-maximized")
# chrome_options.add_argument("--user-data-dir=selenium") #Saves browser history
# chrome_options.add_experimental_option("prefs",{"download.default_directory" : "/home/runner/{REPL_NAME}"}) #Download Directory

driver = webdriver.Chrome(options=chrome_options)

# driver.set_window_size(1150, 650) #Sets Window Size

driver.get("https://www.google.co.jp")
input(" ")
# driver.close()