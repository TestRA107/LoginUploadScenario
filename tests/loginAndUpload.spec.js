const { test, expect } = require('@playwright/test')

test('should be able to login to website with valid credentials and upload profile picture', async ({ page }) => {

    //go to the welcome to the jungle website and check page title
    await page.goto('https://www.welcometothejungle.com/fr');
   
    await expect(page).toHaveTitle(/Welcome to the Jungle.*/)

    //click on button "Se connecter" and wait for login popup to be displayed
    await page.click('button[class="sc-grpWxK fncrht"]')
    expect(page.locator("h4 span")).toHaveText("Bienvenue !")

    //fill the email and password then click on button "se connecter"
    await page.waitForSelector("#modal-content-home")
    //dismiss the cookie popup
    let cookiespopup=await page.locator("div[role='region']");
    if(cookiespopup){
      await page.click("#axeptio_btn_dismiss");
    }
    await page.click('button[class="sc-grpWxK fncrht"]')
    await page.type('#email_login', 'inqom.qaautomationapplicant@gmail.com')
    await page.type('#password', 'o5N,d5ZR@R7^')
    let buttons=await page.$$("button[type='submit']")
    for (const element of buttons){
      let buttonText= await page.evaluate((ele)=>ele.innerText,element)
     if(buttonText=="Se connecter" ){  

        await element.click()
       break
    }}   
   //open account page
   await page.locator("button[type='button']").nth(2).click()
   await page.waitForSelector("#user-logged[open]")//check that list is opened before clicking
   await page.click('a[href="/fr/me/settings/account"]')
   await expect(page).toHaveURL(/.*account/)//check that page is displayed
   await page.waitForSelector("#avatar")
   
   
   //upload picture 
   let filePath = "./tests/photoProfil.jpg"
   await page.locator("input[name='avatar']").setInputFiles(filePath)
    
   // Wait for the page to finish loading
  await page.waitForLoadState('networkidle')

   // Verify that the profile photo was uploaded successfully
     let  profilePhoto = await page.locator('img[class="sc-dZKGDA dhgSdV"]')
  if (!profilePhoto) {
    throw "Profile photo not found"
  }
  //save the modification and verify that the profile photo is successfully uploaded
  await page.locator("button[type='submit']").nth(0).click()
  await expect(page.getByRole('status')).toBeVisible()
  await page.waitForSelector("img[alt='Inqom Inqom']")
  
})


