using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;
using ExpenseView.Service.DataAccessor;
using ExpenseView.Service.DataObject;
using ExpenseView.Service.DataMapper;
using System.Globalization;
using System.Text;

namespace ExpenseView
{
    public partial class RecurringTransactions : System.Web.UI.Page
    {
        //Get the DateFormat and WeekStart for current user and store and generate the start Date and End date and Week Start day accordingly
        public int userDateFormat;
        public int userWeekStart;
        public int userCurrencyFormat;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                UserCategories categories = UserInfoAccessor.GetUserCategories(User.Identity.Name);
                //Store the categories in a session inorder to access them in the dropdownlist and gridview edit templates to change 
                //category-subcategory names based on the Type selection of Income or Expenses
                Session["Categories"] = categories;

                //Get the user's peferred date format
                UserInfo userInfo = UserInfoAccessor.GetUserInfo(User.Identity.Name);
                userDateFormat = userInfo.PreferredDateFormat;
                userWeekStart = userInfo.WeekStartDay;
                userCurrencyFormat = userInfo.AmountDisplayDecimals;

                //Store the User Date and currency format in a session to access it during adding or Binding to grid to format start date and end date 
                //to preferred date format
                Session["userDateFormat"] = userDateFormat;
                Session["userCurrencyFormat"] = userCurrencyFormat;
                Bindgrid();
            }

        }



        /// <summary>
        /// Get all recurring transactions and bind to data drid
        /// </summary>
        public void Bindgrid()
        {
            List<RecurringTransaction> recurringTransList = RecurringTransactionAccessor.GetRecurringTrans(User.Identity.Name);
            if (Session["userDateFormat"] != null)
            {
                userDateFormat = (int)Session["userDateFormat"];
            }

            if (Session["userCurrencyFormat"] != null)
            {
                userCurrencyFormat = (int)Session["userCurrencyFormat"];
            }

            //Format StartDate and EndDate based on the preferredDateFormat
            foreach (RecurringTransaction recurrTrans in recurringTransList)
            {
                //Convert the startdate to the user preferred date format
                recurrTrans.StartDate = UserDataMapper.GetUserPreferredDateFromDefaultDate(recurrTrans.StartDate, userDateFormat);
               
                //Convert the enddate to the user preferred date format
                recurrTrans.EndDate = UserDataMapper.GetUserPreferredDateFromDefaultDate(recurrTrans.EndDate, userDateFormat);

                //Format the amount based on the user preferred currency format
                if (userCurrencyFormat == 0)
                {
                    recurrTrans.Amount = Decimal.Round(recurrTrans.Amount, 0);
                }
                else if (userCurrencyFormat == 2)
                {
                    recurrTrans.Amount = Decimal.Round(recurrTrans.Amount, 2);
                }
                else if (userCurrencyFormat == 3)
                {
                    recurrTrans.Amount= Decimal.Round(recurrTrans.Amount, 3);
                }
            }

            gridView.DataSource = recurringTransList;
            gridView.DataBind();
        }


        /// <summary>
        /// Update Category names based on category type (income or expense)
        /// </summary>
        /// <param name="ddl"></param>
        /// <param name="categoryType"></param>
        private void UpdateCategories(DropDownList ddl, string categoryType)
        {
             UserCategories categories = null;
             if (Session["Categories"] != null)
             {
                 categories = Session["Categories"] as UserCategories;

                 if (categoryType == "E")
                 {
                     ddl.DataSource = GetCategories(categories.ExpenseCategories);
                 }
                 else
                 {
                     ddl.DataSource = GetCategories(categories.IncomeCategories);
                 }

                 ddl.DataValueField = "Key";
                 ddl.DataTextField = "Value";
                 ddl.DataBind();
             }
        }


        /// <summary>
        /// Gets the categories and subcateogies (Category - Subcategory ex. Auto - Gas)
        /// </summary>
        /// <param name="categories"></param>
        /// <returns></returns>
        private Dictionary<string, string> GetCategories(Category[] categories)
        {
            Dictionary<string, string> displayCategories = new Dictionary<string,string>();
            foreach (Category category in categories)
            {
                if (category.SubCategories != null && category.SubCategories.Length > 0)
                {
                    foreach (SubCategory subcategory in category.SubCategories)
                    {
                        string key = category.CategoryID + ":" + subcategory.SubCategoryID;
                        string value = category.Name + " - " + subcategory.Name;

                        displayCategories.Add(key, value);
                    }
                }
                else
                {
                    if (!displayCategories.ContainsKey(category.CategoryID.ToString()))
                    {
                        displayCategories.Add(category.CategoryID.ToString(), category.Name);
                    }
                }
            }

            return displayCategories;
        }

        /// <summary>
        /// Update Recurr details for the day based on the changed recurrtype
        /// </summary>
        /// <param name="ddlRecurrType"></param>
        /// <param name="ddlDayType"></param>
        private void UpdateRecurrDetails(DropDownList ddlRecurrType, DropDownList ddlDayType)
        {
            if (ddlRecurrType.SelectedValue == "W" || ddlRecurrType.SelectedValue == "B")
            {
                ddlDayType.DataSource = Enum.GetNames(typeof(WeekDay));
            }
            else
            {
                //Day of the Month
                List<int> dayofMonth = new List<int>();
                for (int i = 1; i < 32; i++)
                {
                    dayofMonth.Add(i);
                }

                ddlDayType.DataSource = dayofMonth;
            }
            ddlDayType.DataBind();
     
        }

        /// <summary>
        /// Get recurring trans that can be used to add or update data
        /// </summary>
        /// <returns></returns>
        private RecurringTransaction GetRecurrTrans()
        {
            RecurringTransaction recurrTrans = new RecurringTransaction();

            return recurrTrans;
        }


        /// <summary>
        /// Add new RecurringTransaction
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void btnAdd_Click(object sender, EventArgs e)
        {
            RecurringTransaction recurrTrans = new RecurringTransaction();
            recurrTrans.Amount = Convert.ToDecimal(txtAmount.Value);

            //Format StartDate and EndDate to the DB expected format (yyyy-MM-dd)
            if (Session["userDateFormat"] != null)
            {
                userDateFormat = (int)Session["userDateFormat"];
            }

            recurrTrans.StartDate = UserDataMapper.GetDefaultDateFromUserPreferredFormat(txtStartDate.Value, userDateFormat);
            recurrTrans.EndDate = UserDataMapper.GetDefaultDateFromUserPreferredFormat(txtEndDate.Value, userDateFormat);

            string selectedCategory = Request.Form["ddlCategory"];

            if (selectedCategory.Contains(":"))
            {
                string[] ids = selectedCategory.Split(new char[] { ':' });
                recurrTrans.CategoryID = Convert.ToInt32(ids[0]);
                recurrTrans.SubCategoryID = Convert.ToInt32(ids[1]);
            }
            else
            {
                recurrTrans.CategoryID = Convert.ToInt32(selectedCategory);
            }

            string selectedCategoryType = Request.Form["ddlCategoryType"];

            recurrTrans.CategoryType = selectedCategoryType.Equals("Income") ? "I" : "E";

            recurrTrans.RecurringType = Request.Form["ddlRecurringType"];

            if (recurrTrans.RecurringType == "M")
            {
                recurrTrans.Day = Convert.ToInt32(Request.Form["ddlDay"]);
            }
            else
            {
                recurrTrans.Day = Convert.ToInt32(Enum.Parse(typeof(WeekDay), Request.Form["ddlDay"]));
            }
            
            recurrTrans.Description = txtDesc.Value;

            int successValue = RecurringTransactionAccessor.InsertRecurringTrans(User.Identity.Name, recurrTrans);
            
            Bindgrid();

            //Clear data post an add has been completed
            txtAmount.Value = String.Empty;
            txtDesc.Value = String.Empty;
            txtStartDate.Value = String.Empty;
            txtEndDate.Value = String.Empty;
            ddlCategoryType.SelectedIndex = 0;
        }

        
        /// <summary>
        /// Update the Day dropdown details when RecurringType selection has changed
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void ddlRecurringType_SelectedIndexChanged(object sender, EventArgs e)
        {
            //UpdateRecurrDetails(ddlRecurringType, ddlDay);
        }

        /// <summary>
        /// Update the Category Subcategory combination display name based on the changed Category type (Income or Expense)
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void ddlCategoryType_SelectedIndexChanged(object sender, EventArgs e)
        {
         //   UpdateCategories(ddlCategory, ddlCategoryType.SelectedValue);
        }

        

        /// <summary>
        /// Generate enums and text for integer and string values in the grid
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void gridView_RowDataBound(object sender, GridViewRowEventArgs e)
        {
            if (e.Row.RowType == DataControlRowType.DataRow)
            {
                RecurringTransaction recurrTrans = e.Row.DataItem as RecurringTransaction;

                Label lblCatType = (Label)e.Row.FindControl("gvlblCatType");
                if (lblCatType != null)
                {
                    lblCatType.Text = (recurrTrans.CategoryType == "I") ? "Income" : "Expense";
                }

                //Store a combination display = CategoryName - SubCategoryName if subcategory name present
                //otherwise just show CategoryName
                Label lblCategory = (Label)e.Row.FindControl("gvlblCategory");
                if (lblCategory != null)
                {
                    if (recurrTrans.SubCategoryName == null)
                        lblCategory.Text = recurrTrans.CategoryName;
                    else
                        lblCategory.Text = recurrTrans.CategoryName + " - " + recurrTrans.SubCategoryName;
                }

             
                Label lblRecurrType = (Label)e.Row.FindControl("gvlblRecurrType");
                if (lblRecurrType != null)
                {
                    if (recurrTrans.RecurringType == "W")
                        lblRecurrType.Text = "Week";
                    else if (recurrTrans.RecurringType == "B")
                        lblRecurrType.Text = "Biweek";
                    else
                        lblRecurrType.Text = "Month";
                }

                //Generate Day values from Mon-Sun for Week and Biweek
                Label lblDay = (Label)e.Row.FindControl("gvlblDay");
                if (lblDay != null)
                {
                    if (recurrTrans.RecurringType == "W" || recurrTrans.RecurringType == "B")
                        lblDay.Text = Enum.GetName(typeof(WeekDay), recurrTrans.Day);
                    else
                        lblDay.Text = recurrTrans.Day.ToString();
                }

                //Store Category type (Income and Expense)
                DropDownList ddl = (DropDownList)e.Row.FindControl("gvddlCatType");
                if (ddl != null)
                {
                    ListItem listItem = new ListItem("Income", "I");
                    ddl.Items.Add(listItem);
                    listItem = new ListItem("Expense", "E");
                    ddl.Items.Add(listItem);
                    ddl.Items.FindByValue(recurrTrans.CategoryType).Selected = true;

                }

                //Store all category names in dropdownlist
                DropDownList ddl2 = (DropDownList)e.Row.FindControl("gvddlCat");
                if (ddl2 != null)
                {
                    UpdateCategories(ddl2, recurrTrans.CategoryType);
                    string key;
                    if (recurrTrans.SubCategoryID == 0)
                    {
                        //store a key of just the CategoryID
                        key = recurrTrans.CategoryID.ToString();
                    }
                    else
                    {
                        //store a combination key = CategoryID : SubCategoryID if subcategory exists
                        //otherwise store key = CategoryID
                        key = recurrTrans.CategoryID.ToString() + ":" + recurrTrans.SubCategoryID.ToString();
                    }

                    ListItem foundItem = ddl2.Items.FindByValue(key);
                    if (foundItem != null)
                    {
                        foundItem.Selected = true;
                    }

                }

                //Generate RecurrType
                DropDownList ddl3 = (DropDownList)e.Row.FindControl("gvddlRecurrType");
                if (ddl3 != null)
                {
                    ListItem listItem = new ListItem("Week", "W");
                    ddl3.Items.Add(listItem);
                    listItem = new ListItem("Biweek", "B");
                    ddl3.Items.Add(listItem);
                    listItem = new ListItem("Month", "M");
                    ddl3.Items.Add(listItem);
                    ddl3.Items.FindByValue(recurrTrans.RecurringType).Selected = true;
                }

                DropDownList ddl4 = (DropDownList)e.Row.FindControl("gvddlDay");
                if (ddl4 != null)
                {
                    //Recurr Type == Week or Biweek
                    if (recurrTrans.RecurringType == "W" || recurrTrans.RecurringType == "B")
                    {
                        foreach (int value in Enum.GetValues(typeof(WeekDay)))
                        {
                            ListItem item = new ListItem(Enum.GetName(typeof(WeekDay), value), value.ToString());
                            ddl4.Items.Add(item);
                        }
                    }
                    else
                    {
                        //Recurr Type == Month
                        //Day of the Month
                        List<int> dayofMonth = new List<int>();
                        for (int i = 1; i < 32; i++)
                        {
                            dayofMonth.Add(i);
                        }

                        ddl4.DataSource = dayofMonth;
                    }

                    ddl4.DataBind();
                    ddl4.Items.FindByValue(recurrTrans.Day.ToString()).Selected = true;
                }
            }
        }

        /// <summary>
        /// Deletes the row in the database and updates the grid 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void gridView_RowDeleting(object sender, GridViewDeleteEventArgs e)
        {
            int recurringTransID = (int)gridView.DataKeys[e.RowIndex].Value;
        
            // Delete the record 
            RecurringTransactionAccessor.DeleteRecurringTrans(User.Identity.Name, recurringTransID);
            Bindgrid();
        }


        /// <summary>
        /// Begin edit mode in grid
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void gridView_RowEditing(object sender, GridViewEditEventArgs e)
        {
            gridView.EditIndex = e.NewEditIndex;
            Bindgrid();
        }

        /// <summary>
        /// Cancel edit mode in grd
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void gridView_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
        {
            //Reset the edit index.
            gridView.EditIndex = -1;
            Bindgrid();

        }

        /// <summary>
        /// Udpate recurring transaction to the db and reload the data in the grid
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void gridView_RowUpdating(object sender, GridViewUpdateEventArgs e)
        {
            int recurringTransID = (int)gridView.DataKeys[e.RowIndex].Value;

            RecurringTransaction recurrTrans = new RecurringTransaction();
            recurrTrans.RecurringTransID = recurringTransID;

            GridViewRow row = (GridViewRow)gridView.Rows[e.RowIndex];

            if (row != null)
            {
                DropDownList ddl = row.FindControl("gvddlCatType") as DropDownList;
                if(ddl != null)
                    recurrTrans.CategoryType = ddl.SelectedValue;

                DropDownList ddlCat = row.FindControl("gvddlCat") as DropDownList;
                if (ddlCat != null && ddlCat.SelectedValue.Contains(":"))
                {
                    string[] ids = ddlCat.SelectedValue.Split(new char[] { ':' });
                    recurrTrans.CategoryID = Convert.ToInt32(ids[0]);
                    recurrTrans.SubCategoryID = Convert.ToInt32(ids[1]);
                }
                else
                {
                    recurrTrans.CategoryID = Convert.ToInt32(ddlCat.SelectedValue);
                }


                string value = e.NewValues["Amount"] as string;
                recurrTrans.Amount = Convert.ToDecimal(value);

                //Parse the date from the preferred date format so that the month and day are correct.
                if (Session["userDateFormat"] != null)
                {
                    userDateFormat = (int)Session["userDateFormat"];
                }

                recurrTrans.StartDate = UserDataMapper.GetDefaultDateFromUserPreferredFormat((row.FindControl("gvtxtStDate") as TextBox).Text, userDateFormat);
                recurrTrans.EndDate = UserDataMapper.GetDefaultDateFromUserPreferredFormat((row.FindControl("gvtxtEnDate") as TextBox).Text, userDateFormat);

                recurrTrans.Description = e.NewValues["Description"] as string;

                DropDownList ddlRecurrType = row.FindControl("gvddlRecurrType") as DropDownList;
                recurrTrans.RecurringType = ddlRecurrType.SelectedValue;
                DropDownList ddlDay = row.FindControl("gvddlDay") as DropDownList;
                if (recurrTrans.RecurringType == "M")
                {
                    recurrTrans.Day = Convert.ToInt32(ddlDay.SelectedValue);
                }
                else
                {
                    recurrTrans.Day = Convert.ToInt32(Enum.Parse(typeof(WeekDay), ddlDay.SelectedValue));
                }
                // Update the record 
                int success = RecurringTransactionAccessor.UpdateRecurringTrans(User.Identity.Name, recurrTrans);
            }
            //Reset the edit index.
            gridView.EditIndex = -1;
            Bindgrid();

        }

     
        /// <summary>
        /// GridView Category Type selection has changed, update category names accordingly (Income or Expense categories)
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void gvddlCatType_SelectedIndexChanged(object sender, EventArgs e)
        {
            //UpdateCategoryDetails(sender, "gvddlCat");
            GridViewRow row = ((DropDownList)sender).Parent.Parent as GridViewRow;
            if (row != null)
            {
                DropDownList ddlCat = (DropDownList)row.FindControl("gvddlCat");
                if (ddlCat != null)
                {
                    UpdateCategories(ddlCat, ((DropDownList)sender).SelectedValue);
                }
            }
        }

        /// <summary>
        /// GridView selection has changed, update recurring Day detail for Week, Biweek or month
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void gvddlRecurrType_SelectedIndexChanged(object sender, EventArgs e)
        {
            GridViewRow row = ((DropDownList)sender).Parent.Parent as GridViewRow;
            if (row != null)
            {
                DropDownList ddlDay = (DropDownList)row.FindControl("gvddlDay");
                if (ddlDay != null)
                {
                    UpdateRecurrDetails((DropDownList)sender, ddlDay);
                }
            }
        }

        /// <summary>
        /// Handle Page Index changing if datasource isnt directly connected to grid view to populate the data
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void gridView_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            gridView.PageIndex = e.NewPageIndex;
            Bindgrid();
        }


    }
}