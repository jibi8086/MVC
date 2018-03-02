   if (ModelState.IsValid)
                {

                    ViewBag.validationMessage = string.Empty;
                    NuPortalDBService.NuPortalService dbService = new NuPortalDBService.NuPortalService();
                    dbService.Url = Constants.DBService;
                    DataTable dtLogin = JsonConvert.DeserializeObject<DataTable>(dbService.LoginInfo(Login.userName, Login.password, 1));
                    if (dtLogin.Rows.Count > 0)
                    {
                        int oItem = Convert.ToInt32(dtLogin.Rows[0]["UserExists"]);
                        if (oItem == 1)
                        {
                            FormsAuthentication.RedirectFromLoginPage("SetCookie", false);
                            Session["CompanyId"] = Convert.ToInt32(dtLogin.Rows[0]["FK_CompanyId"]); 
                            Session["EmpID"] = Convert.ToInt32(dtLogin.Rows[0]["FK_EmpId"]);
                            Session["LType"] = Convert.ToInt32(dtLogin.Rows[0]["LoginType"]);
                            int loginType = Convert.ToInt32(dtLogin.Rows[0]["LoginType"]);
                            
                            if (loginType == 1)
                                return RedirectToAction("Home", "Home");
                           else if (loginType == 2)
                                return RedirectToAction("Home", "Home");
                        }
                        else if (oItem == 0)
                            Login.ErrorMessage = "User does not exists";
                        else if (oItem == 2)
                            Login.ErrorMessage = "Password and username does not match";
                    }
                    else
                        Login.ErrorMessage = "Login attempt failed due to service unavailability";
                }
                else
                    Login.ErrorMessage = "* fields are mandatory";
            }
            catch (Exception ex)
            {
                GeneralFunctions genFun = new GeneralFunctions();
                genFun.LogError(ControllerContext.HttpContext, ex.Message, ex.TargetSite.Name,
                    Convert.ToString(ControllerContext.RouteData.Values["action"]),
                    Convert.ToString(ControllerContext.RouteData.Values["controller"]));
                genFun = null;
            }
            return View("LoginView",Login);
        }
