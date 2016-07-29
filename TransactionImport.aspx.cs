using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
//using System.Web.Security;
using System.Web.UI.WebControls;
using ExpenseView.Service.DataAccessor;
using ExpenseView.Service.DataObject;
using ExpenseView.Service.TransImport;


///// <summary>
///// Summary description for Import Statements
///// </summary>
namespace ExpenseView
{
    public partial class TransactionImport : System.Web.UI.Page
    {
        public enum StatementType
        {
            Bank = 1,
            Credit = 2
        }

        public enum CategoryType
        {
            E = 1,
            I = 2
        }

        private List<CategoryInfo> _expenseCategories;
        private List<CategoryInfo> _incomeCategories;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["expenseCategories"] != null && Session["incomeCategories"] != null)
            {
                _expenseCategories = (List<CategoryInfo>)Session["expenseCategories"];
                _incomeCategories = (List<CategoryInfo>)Session["incomeCategories"];
            }
        }

        /// <summary>
        /// Parse the bank or credit card ofx statements and load the data into the GridView
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void uploadBtn_Click(object sender, EventArgs e)
        {
            string msg = "Please select an .ofx or .qfx file to import.";

            if (!String.IsNullOrEmpty(filename.Value))
            {
                string extension = filename.Value.Substring(filename.Value.Length - 4, 4);
                extension = extension.ToLower();
                if (extension == ".ofx" || extension == ".qfx")
                {
                    UpdateView(String.Empty, true);

                    if (filename.PostedFile != null)
                    {
                        string fn = System.IO.Path.GetFileName(filename.PostedFile.FileName);
                        string saveLocation = Server.MapPath("Upload") + "\\" + fn;
                        filename.PostedFile.SaveAs(saveLocation);

                        string ofxFileString = File.ReadAllText(saveLocation);

                        List<Transaction> transList = OFXFileImporter.GetTransactionsFromFile(ofxFileString);

                        if (transList != null && transList.Count > 0)
                        {
                            ShowStatement(transList);
                        }
                    }
                }
                else
                    UpdateView(msg, false);
            }
            else
            {
                UpdateView(msg, false);
            }
        }

        /// <summary>
        /// Update the errorLabel text and set Visibility of ui controls
        /// </summary>
        /// <param name="message"></param>
        /// <param name="isVisible"></param>
        private void UpdateView(string message, bool isVisible)
        {
            if(isVisible)
                errorLbl.CssClass = "spanhidden";
            else
                errorLbl.CssClass = "loginMsgText spanVisible";
            errorLbl.Text = message;
            gridView.Visible = isVisible;
            lbl_SaveDisclosure.Visible = isVisible;
            btnMultipleRowDelete.Visible = isVisible;
            saveBtn.Visible = isVisible;
            btnCancel.Visible = isVisible;     
       
        }

        /// <summary>
        /// Build the table to display in the GridView
        /// </summary>
        /// <param name="ds"></param>
        /// <returns></returns>
        private DataTable BuildTable(DataSet ds)
        {
            DataTable table = new DataTable("OfxData");
            ds.Tables.Add(table);
            DataColumn dc = new DataColumn("Type", System.Type.GetType("System.String"));
            table.Columns.Add(dc);

            dc = new DataColumn("Category", System.Type.GetType("System.String"));
            table.Columns.Add(dc);

            dc = new DataColumn("Date", System.Type.GetType("System.String"));
            table.Columns.Add(dc);

            dc = new DataColumn("Amount", System.Type.GetType("System.String"));
            table.Columns.Add(dc);

            dc = new DataColumn("FormattedDate", System.Type.GetType("System.String"));
            table.Columns.Add(dc);

            dc = new DataColumn("Description", System.Type.GetType("System.String"));
            table.Columns.Add(dc);

            return table;

        }

        private void ShowStatement(List<Transaction> transactions)
        {
            UserSummary userSummary = UserInfoAccessor.GetUserSummary(User.Identity.Name, DateTime.Now);

            //Create Expense And Income CategoryInfo Lists from user summary
            //These will be used to populate the drop down for the import table
            _expenseCategories = GetCategoryInfoList(userSummary.ExpenseCategories);
            _incomeCategories = GetCategoryInfoList(userSummary.IncomeCategories);

            //Save these values to session so they don't have to be retrieved again
            Session["expenseCategories"] = _expenseCategories;
            Session["incomeCategories"] = _incomeCategories;

            DataSet ds = new DataSet();
            DataTable table = BuildTable(ds);

            foreach (Transaction trans in transactions)
            {
                DataRow dataRow = table.NewRow();

                if (trans.Amount > 0)
                {
                    dataRow["Type"] = "Income";
                }
                else
                {
                    dataRow["Type"] = "Expense";
                }

                dataRow["Date"] = trans.Date;

                DateTime date = DateTime.Parse(trans.Date);

                //userDateFormat is set globally app initiation method
                if (userSummary.PreferredDateFormat == 1)
                {
                    //format == YYYY-MM-DD
                    dataRow["FormattedDate"] = date.ToString("yyyy-MM-dd");
                }
                else if (userSummary.PreferredDateFormat == 2)
                {
                    //format == MM/DD/YYYY
                    dataRow["FormattedDate"] = date.ToString("MM/dd/yyyy");
                }
                else if (userSummary.PreferredDateFormat == 3)
                {
                    //format == DD/MM/YYYY
                    dataRow["FormattedDate"] = date.ToString("dd/MM/yyyy");
                }

                dataRow["Amount"] = trans.Amount;
                dataRow["Description"] = trans.Description;
                table.Rows.Add(dataRow);
            }

            Session["ofxDataSet"] = ds;

            gridView.DataSource = ds;
            gridView.DataBind();
            gridView.Visible = true;

            this.saveBtn.Visible = true;
            this.btnMultipleRowDelete.Visible = true;
            this.btnCancel.Visible = true;
            this.lbl_SaveDisclosure.Visible = true;
        }


        private List<CategoryInfo> GetCategoryInfoList(Category[] categories)
        {
            List<CategoryInfo> categoryInfoList = new List<CategoryInfo>();
            foreach (Category cat in categories)
            {
                CategoryInfo info = new CategoryInfo();
                info.CategoryName = cat.Name;
                info.CategoryID = cat.CategoryID;
                info.isSubCategegory = false;
                categoryInfoList.Add(info);

                //Add SubCategories
                if (cat.SubCategories != null)
                {
                    foreach (SubCategory subCat in cat.SubCategories)
                    {
                        CategoryInfo subCatInfo = new CategoryInfo();
                        subCatInfo.isSubCategegory = true;
                        subCatInfo.CategoryID = subCat.CategoryID;
                        subCatInfo.CategoryName = cat.Name;
                        subCatInfo.SubCategoryID = subCat.SubCategoryID;
                        subCatInfo.SubCategoryName = subCat.Name;

                        categoryInfoList.Add(subCatInfo);
                    }
                }
            }

            return categoryInfoList;
        }

        protected void btnMultipleRowDelete_Click(object sender, EventArgs e)
        {
            DataSet ds = (DataSet)Session["ofxDataSet"];

            List<DataRow> removedRows = new List<DataRow>();

            // Looping through all the rows in the dataset and see what needs to be removed
            // This needs to be done first before actually removing the rows in order to prevent index out of 
            // range exceptions
            foreach (GridViewRow row in gridView.Rows)
            {                
                CheckBox checkbox = (CheckBox)row.FindControl("cbRows");
             
                //Check if the checkbox is checked.
                if (checkbox.Checked)
                {
                    DataRow rowDel = ds.Tables[0].Rows[row.RowIndex];
                    removedRows.Add(rowDel);
                }
            }

            //Remove them from the dataset
            foreach (DataRow removedRow in removedRows)
            {
                ds.Tables[0].Rows.Remove(removedRow);
            }


            Session["ofxDataSet"] = ds;
            gridView.DataSource = ds;

            gridView.DataBind();
        }


        /// <summary>
        /// Bound the Categories into the dropdownlist based on the categorytype Income or Expense
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void GridView_RowDatabound(object sender, GridViewRowEventArgs e)
        {
            if (e.Row.RowType == DataControlRowType.DataRow)
            {
                string type = e.Row.Cells[1].Text;

                DropDownList ddl = (DropDownList)e.Row.FindControl("drpdwnlist");
                List<CategoryInfo> categories = null;
                if (type == "Income")
                {
                    e.Row.BackColor = System.Drawing.Color.FromArgb(159, 247, 99);
                    categories = _incomeCategories;
                }
                else
                {
                    e.Row.BackColor = System.Drawing.Color.FromArgb(231,239,255) ;
                    categories = _expenseCategories;
                }

                ddl.DataSource = categories;
                ddl.DataBind();
            }
        }


        /// <summary>
        /// Save the transaction details to the database
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void saveBtn_Click(object sender, EventArgs e)
        {
            List<Transaction> transList = new List<Transaction>();

            foreach (GridViewRow row in this.gridView.Rows)
            {
                string type = row.Cells[1].Text;
                Transaction transaction = new Transaction();

                //categorytype
                if (type == "Income")
                {
                    transaction.CategoryType = CategoryType.I.ToString();
                }
                else if (type == "Expense")
                {
                    transaction.CategoryType = CategoryType.E.ToString();
                }

                //categoryname categoryID
                DropDownList ddl = (DropDownList)row.FindControl("drpdwnlist");
                if (ddl != null)
                {
                    transaction.CategoryName = ddl.SelectedItem.Text;
                    
                    transaction.CategoryID = CategoryInfo.GetCategoryIDFromComboID(ddl.SelectedItem.Value);
                    transaction.SubCategoryID = CategoryInfo.GetSubCategoryIDFromComboID(ddl.SelectedItem.Value);
                }

                //Date
                transaction.Date = row.Cells[5].Text;

                //Amount
                if (row.Cells[4].Text != null)
                {
                    transaction.Amount = Math.Abs(Convert.ToDecimal(row.Cells[4].Text));
                }

                //Description
                TextBox txtBox = (TextBox)row.FindControl("Description");
                if (txtBox != null)
                {
                    transaction.Description = txtBox.Text;
                }

                transList.Add(transaction);
            }

            int result = TransactionAccessor.InsertTransList(User.Identity.Name, transList);

            this.btnCancel.Visible = false;
            this.gridView.Visible = false;
            this.saveBtn.Visible = false;
            this.btnMultipleRowDelete.Visible = false;
            this.errorLbl.Text = "";
            this.lbl_SaveDisclosure.Visible = false;

            if (result == 1)
            {
                errorLbl.ForeColor = System.Drawing.Color.Black;
                errorLbl.Text = "Your transactions have been imported successfully.";
            }
            else
            {
                errorLbl.ForeColor = System.Drawing.Color.Red;
                errorLbl.Text = "Error ocurred when importing transactions. Please try again.";
            }
        }

        protected void btnCancel_Click(object sender, EventArgs e)
        {
            //Remove any session data
            Session["expenseCategories"] = null;
            Session["incomeCategories"] = null;
            Session["ofxDataSet"] = null;

            //Hide all Controls
            this.btnCancel.Visible = false;
            this.gridView.Visible = false;
            this.saveBtn.Visible = false;
            this.btnMultipleRowDelete.Visible = false;
            this.errorLbl.Text = "";
            this.lbl_SaveDisclosure.Visible = false;

        }
    }

    /// <summary>
    /// Data object to store categorya and sub category data.
    /// Used to populated datagrid drop-down list
    /// </summary>
    public class CategoryInfo
    {
        public string CategoryName;
        public int CategoryID;
        public bool isSubCategegory;
        public string SubCategoryName;
        public int SubCategoryID;

        public string ComboName
        {
            get
            {
                if (isSubCategegory)
                {
                    return CategoryName + " - " + SubCategoryName;
                }
                else
                {
                    return CategoryName;
                }
            }

            set { }
        }
        
        public string ComboID
        {
            get { return CategoryID + ":" + SubCategoryID; }
            set { }
        }

        public static int GetCategoryIDFromComboID(string comboID) 
        {
            return Int32.Parse(comboID.Split(':')[0]);
        }

        public static int GetSubCategoryIDFromComboID(string comboID)
        {
            return Int32.Parse(comboID.Split(':')[1]); 
        }
    }
}