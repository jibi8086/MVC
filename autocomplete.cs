     [HttpPost]
        public JsonResult LoadTaskName(int Project, string EmpName, int Operation)
        {

            try
            {
                Dictionary<string, string> oItems = new Dictionary<string, string>();
                NuPortalProjectService.NuPortalProjectService prjService = new NuPortalProjectService.NuPortalProjectService();
                prjService.Url = Constants.ProjectService;
                DataTable dtAutoComplete = JsonConvert.DeserializeObject<DataTable>(prjService.TaskNameAutoComplete(1, EmpName));
                if (dtAutoComplete != null && dtAutoComplete.Rows.Count > 0)
                {
                    for (int i = 0; i < dtAutoComplete.Rows.Count; i++)
                    {
                        oItems.Add(dtAutoComplete.Rows[i]["TaskId"].ToString(), dtAutoComplete.Rows[i]["TaskName"].ToString());
                    }
                }


                return Json(oItems.ToList());


                //NuPortalProjectService.NuPortalProjectService autocomplete = new NuPortalProjectService.NuPortalProjectService();
                //autocomplete.Url = Constants.ProjectService;
                //string autoComplete = autocomplete.TaskNameAutoComplete(1, TaskName);
                //return Json(autoComplete, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(-1, JsonRequestBehavior.AllowGet);
                throw;
            }

        }
