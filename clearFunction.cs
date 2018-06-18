Skip to content
 
Search or jump to…

Pull requests
Issues
Marketplace
Explore
 @jibi8086 Sign out
0
0 0 sanal28/MVc
 Code  Issues 0  Pull requests 0  Projects 0  Wiki  Insights
MVc/ClearAllControls_By_divId.cs
5601341  7 minutes ago
@sanal28 sanal28 Create ClearAllControls_By_divId.cs
     
70 lines (62 sloc)  3.11 KB
//
  <div class="popupsubdiv" id="divClearPwdChange">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="callabel">Old Password</div>
                            <div class="inputtextdiv" id="divtextname"><input class="calentextbox" type="password" id="txtOldPassword"></div>
                        </div>
                        <div class="col-md-12">
                            <div class="callabel">New Password</div>
                            <div class="inputtextdiv" id="divtextname"><input class="calentextbox" type="password" id="txtNewPassword"></div>
                        </div>
                        <div class="col-md-12">
                            <div class="callabel">Confirm Password</div>
                            <div class="inputtextdiv" id="divtextname"><input class="calentextbox" type="password" id="txtConfirmPassword"></div>
                        </div>
                        <div class="ErrorLabel"><label id="lblMessageChangePwd" class="lblMessage"></label></div>
                        <button title="Save" class="submitbtn" onclick="changePassword()"><i class="far fa-save"></i></button>
                        <button title="Clear" class="submitbtn" onclick="clearControlsChangePwd();"><i class="fa fa-eraser"></i></button>
                        
                    </div>
                </div>
//

//
 function clearControlsChangePwd()
        {
            ClearAllControlValues('divClearPwdChange');
            $('#lblMessageChangePwd').text("");
        }
//

//
//Clear all controls

function ClearAllControlValues(divID) {
    var searchElms = document.getElementById(divID).getElementsByTagName("*");
    for (i = 0; i < searchElms.length; i++) {
        var elmt = searchElms[i];
        var type = searchElms[i].type;
        var tag = searchElms[i].tagName.toLowerCase(); // normalize case

        // to reset the value attr of text inputs,
        // password inputs, fileUpload and textareas
        if (type == 'text' || type == 'password' || type == 'textarea' || tag == 'textarea' || type == 'file' || type == "hidden")
            elmt.value = "";
            // checkboxes and radios need to have their checked state cleared                
        else if (type == 'checkbox' || type == 'radio')
            elmt.checked = false;
            //single select elements need to have their 'selectedIndex' property set to -1               
        else if (type == 'select-one') {
            //elmt.options[0].selected = true;
            $(elmt).attr("value", "");

        }
            //multi select elements need to have their selection clear
        else if (type == 'select-multiple') {
            while (elmt.selectedIndex != -1) {
                indx = elmt.selectedIndex;
                elmt.options[indx].selected = false;
            }
            elmt.selected = false;
        }
            //else if (tag == "span" && (elmt.className != "ms-inputuserfield" && elmt.className != "rightpeoplepickertextbox") && elmt.className != "required")
            //    elmt.innerText = "";
            
    }    
    return false;
}
