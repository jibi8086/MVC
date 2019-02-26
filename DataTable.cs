  if (objFilter.Flag == 2)
            {
                if (dSetTellerScroll != null && dSetTellerScroll.Tables.Count > 0)
                {
                    DataTable dtFromDB = new DataTable();
                    dtFromDB = dSetTellerScroll.Tables[0];
                    for (int i = 0;i <dtFromDB.Rows.Count;i++)
                    {
                        dtFromDB.Rows[i]["CONVERSION_VALUE"] = Convert.ToDouble(dtFromDB.Rows[i]["CONVERSION_VALUE"]);
                    }
                    dtFromDB.AcceptChanges();

                    DataView dview = dtFromDB.DefaultView;
                    dview.Sort = "TELLER_TRANS_ID ASC";
                    DataTable dtFromDBSorted = dview.ToTable();
                    DataTable dtCurrencyWise = dtFromDBSorted.DefaultView.ToTable(true, "NARRATION", "TELLER_TRANS_ID", "TRANS_NUMBER", "TRANS_TYPE");

                    DataTable dtCurrencyDenimination = new DataTable();
                    dtCurrencyDenimination.Columns.Add("CURRENCY");
                    dtCurrencyDenimination.Columns.Add("DENOMINATIONS");
                    dtCurrencyDenimination.TableName = "ResultSet1";

                    var currencyList = dtFromDBSorted.AsEnumerable().Select(s =>  Convert.ToString(s["CURRENCY_NAME"])).ToList().Distinct();

                    foreach (var currency in currencyList)
                    {
                        DataRow dRowCurrencyDenomination = dtCurrencyDenimination.NewRow();
                        dRowCurrencyDenomination["CURRENCY"] = currency;

                        var denominationList = (from x in dtFromDBSorted.AsEnumerable()
                                           where Convert.ToString(x["CURRENCY_NAME"])  == currency
                                               select x["CONVERSION_VALUE"]).ToList().Distinct().OrderByDescending(k => k); ;

                        dRowCurrencyDenomination["DENOMINATIONS"] = String.Join(",", denominationList);

                        foreach (var denomination in denominationList)
                        {
                            dtCurrencyWise.Columns.Add(currency +"_" + denomination );
                        }
                        dtCurrencyWise.Columns.Add(currency +  "_Total");
                        dtCurrencyDenimination.Rows.Add(dRowCurrencyDenomination);

                    }
                    dtCurrencyDenimination.AcceptChanges();
                    dtCurrencyWise.AcceptChanges();

                    decimal transactionID = decimal.Zero;
                    string currencyDenomination = string.Empty;
                    int transactionType = 0;
                    decimal sumOfCurrencyForTransaction = decimal.Zero;
                    
                    for (int i=0; i < dtCurrencyWise.Rows.Count; i++)
                    {
                        transactionID = Convert.ToDecimal(dtCurrencyWise.Rows[i]["TELLER_TRANS_ID"]);
                        transactionType = Convert.ToInt16(dtCurrencyWise.Rows[i]["TRANS_TYPE"]);

                        var transactionCurrencyList = (from x in dtFromDBSorted.AsEnumerable()
                                                where Convert.ToDecimal(x["TELLER_TRANS_ID"]) == transactionID
                                                       select x["CURRENCY_NAME"]).Distinct().ToList();
                        foreach (string transactionCurrency in transactionCurrencyList)
                        {
                            sumOfCurrencyForTransaction = decimal.Zero;

                            DataTable dtTransaction_Currency_Rows = (from row in dtFromDBSorted.AsEnumerable()
                                                              where ( Convert.ToDecimal(row["TELLER_TRANS_ID"]) == transactionID 
                                                              && Convert.ToString(row["CURRENCY_NAME"]) == transactionCurrency)
                                                                     select row).CopyToDataTable();

                            var Currency_Denominations_TransType = (from x in dtTransaction_Currency_Rows.AsEnumerable()
                                                                     select x["CONVERSION_VALUE"]).Distinct().ToList().OrderBy(k => k);

                            foreach (decimal decConversionValue in Currency_Denominations_TransType)
                            {
                                decimal denominationCount = (from denomination in dtTransaction_Currency_Rows.AsEnumerable()
                                                             where Convert.ToDecimal(denomination["CONVERSION_VALUE"]) == decConversionValue
                                                             select denomination).Sum(row => Convert.ToDecimal(row["DENOMINATION_COUNT"]));

                                currencyDenomination = transactionCurrency + "_" + Convert.ToString(decConversionValue);
                                if (transactionType == 1)
                                    dtCurrencyWise.Rows[i][currencyDenomination] = Convert.ToString(denominationCount);
                                else if (transactionType == 2)
                                    dtCurrencyWise.Rows[i][currencyDenomination] = "-" + Convert.ToString(denominationCount);

                                sumOfCurrencyForTransaction = sumOfCurrencyForTransaction + (denominationCount * decConversionValue);
                            }

                            if (transactionType == 1)
                                dtCurrencyWise.Rows[i][transactionCurrency + "_Total"] = Convert.ToString(sumOfCurrencyForTransaction);
                            else if (transactionType == 2)
                                dtCurrencyWise.Rows[i][transactionCurrency + "_Total"] =  "-" + Convert.ToString(sumOfCurrencyForTransaction);

                            dtCurrencyWise.AcceptChanges();
                        }
                    }

                    DataRow dRowTotal = dtCurrencyWise.NewRow();

                    var amountColumns = dtCurrencyWise.Columns.Cast<DataColumn>().Where(c => c.Ordinal > 3 );

                    foreach (DataColumn colToFindSum in amountColumns)
                    {
                        var currencyTotal = (from balance in dtCurrencyWise.AsEnumerable()
                                             where Convert.ToString(balance[colToFindSum]) != string.Empty
                                             select balance).Sum(row => Convert.ToDecimal(row[colToFindSum]));
                        dRowTotal[colToFindSum] = Convert.ToString(currencyTotal);
                    }

                    dtCurrencyWise.Rows.Add(dRowTotal);
                    dtCurrencyWise.AcceptChanges();

                    retrievableDataSet.returnDataSet = new DataSet();
                    retrievableDataSet.returnDataSet.Tables.Add(dtCurrencyWise);
                    retrievableDataSet.returnDataSet.Tables.Add(dtCurrencyDenimination);
                }
            }
            else if (objFilter.Flag == 1)
            {
                if (dSetTellerScroll != null && dSetTellerScroll.Tables.Count > 0)
                {
                    DataTable dtFromDB = new DataTable();
                    dtFromDB = dSetTellerScroll.Tables[0];

                    DataView dview = dtFromDB.DefaultView;
                    dview.Sort = "TELLER_TRANS_ID ASC";
                    DataTable dtFromDBSorted = dview.ToTable();

                    DataTable dtDistinctTransactionDetails = dtFromDBSorted.DefaultView.ToTable(true, "NARRATION", "TELLER_TRANS_ID", "CREATED_ON", "TRANS_TYPE", "TRANS_NUMBER");

                    AddCurrencyColumnsToDataTable(dtDistinctTransactionDetails, dtFromDBSorted, 1);//Deposit 
                    AddCurrencyColumnsToDataTable(dtDistinctTransactionDetails, dtFromDBSorted, 2);///Withdraw
                    AddCurrencyColumnsToDataTable(dtDistinctTransactionDetails, dtFromDBSorted, 0);//Opening Balance

                    int transactionID = 0;
                    int transactionType = 0;
                    string strTransationType = string.Empty;
                    string strTransactionCurrency = string.Empty;
                    for (int i = 0; i < dtDistinctTransactionDetails.Rows.Count; i++)
                    {
                        transactionID = Convert.ToInt16(dtDistinctTransactionDetails.Rows[i]["TELLER_TRANS_ID"]);
                        transactionType = Convert.ToInt16(dtDistinctTransactionDetails.Rows[i]["TRANS_TYPE"]);
                        if (transactionType == 1 && transactionID != 0)
                            strTransationType = "Deposit_";
                        else if (transactionType == 2 && transactionID != 0)
                            strTransationType = "Withdraw_";
                        else if (transactionID == 0)
                            strTransationType = "Balance_";

                        string currencyPrevoiusBalance = string.Empty;
                        decimal currencyCurrentBalance = decimal.Zero;

                        DataTable dtTransCurrencyAmount = (from row in dtFromDBSorted.AsEnumerable()
                                                           where Convert.ToDecimal(row["TELLER_TRANS_ID"]) == transactionID
                                                           select row).CopyToDataTable();
                        for (int j = 0; j < dtTransCurrencyAmount.Rows.Count; j++)
                        {
                            strTransactionCurrency = Convert.ToString(dtTransCurrencyAmount.Rows[j]["CURRENCY_NAME"]);
                            dtDistinctTransactionDetails.Rows[i][strTransationType + strTransactionCurrency] = Convert.ToString(dtTransCurrencyAmount.Rows[j]["TRANS_AMOUNT"]);

                            if (transactionID != 0)
                            {
                                var varBalance = (from balance in dtDistinctTransactionDetails.AsEnumerable()
                                          where Convert.ToString(balance["Balance_" + strTransactionCurrency]) != string.Empty
                                          select balance).LastOrDefault();

                                if (varBalance != null)
                                {
                                    currencyPrevoiusBalance = Convert.ToString(varBalance["Balance_" + strTransactionCurrency]);
                                    if (transactionType == 1)
                                        currencyCurrentBalance = Convert.ToDecimal(currencyPrevoiusBalance) + Convert.ToDecimal(dtTransCurrencyAmount.Rows[j]["TRANS_AMOUNT"]);
                                    else if (transactionType == 2)
                                        currencyCurrentBalance = Convert.ToDecimal(currencyPrevoiusBalance) - Convert.ToDecimal(dtTransCurrencyAmount.Rows[j]["TRANS_AMOUNT"]);
                                }
                                else
                                {
                                    if (transactionType == 1)
                                        currencyCurrentBalance = Convert.ToDecimal(dtTransCurrencyAmount.Rows[j]["TRANS_AMOUNT"]);
                                    else if (transactionType == 2)
                                        currencyCurrentBalance = 0 - Convert.ToDecimal(dtTransCurrencyAmount.Rows[j]["TRANS_AMOUNT"]);
                                    currencyPrevoiusBalance = string.Empty;
                                }

                                dtDistinctTransactionDetails.Rows[i]["Balance_" + strTransactionCurrency] = (currencyCurrentBalance == 0 ? string.Empty : Convert.ToString(currencyCurrentBalance));
                            }
                        }
                        dtDistinctTransactionDetails.AcceptChanges();
                    }

                    List<string> listCurrencyColumns = new List<string>();
                    GetTransactionCurrencyColumns("Deposit_", dtDistinctTransactionDetails, listCurrencyColumns);
                    GetTransactionCurrencyColumns("Withdraw_", dtDistinctTransactionDetails, listCurrencyColumns);

                    DataTable dtCurrencyTotals = new DataTable();
                    dtCurrencyTotals.TableName = "ResultSet1";
                    foreach (string columnName in listCurrencyColumns)
                    {
                        dtCurrencyTotals.Columns.Add(columnName);
                    }
                    dtCurrencyTotals.AcceptChanges();
                    DataRow dRow = dtCurrencyTotals.NewRow();
                    foreach (string columnName in listCurrencyColumns)
                    {
                        var currencyTotal = (from balance in dtDistinctTransactionDetails.AsEnumerable()
                                             where Convert.ToString(balance[columnName]) != string.Empty
                                             select balance).Sum(row => Convert.ToDecimal(row[columnName]));
                        dRow[columnName] = Convert.ToString(currencyTotal);
                    }

                    dtCurrencyTotals.Rows.Add(dRow);
                    dtCurrencyTotals.AcceptChanges();

                    retrievableDataSet.returnDataSet = new DataSet();
                    retrievableDataSet.returnDataSet.Tables.Add(dtDistinctTransactionDetails);
                    retrievableDataSet.returnDataSet.Tables.Add(dtCurrencyTotals);
                }
            }
            return retrievableDataSet;
        }


        private void AddCurrencyColumnsToDataTable(DataTable dtTransaction, DataTable dtDb, int transType)
        {
            var results = (from row in dtDb.AsEnumerable()
                           where (transType!= 0 && Convert.ToDecimal(row["TRANS_TYPE"]) == transType && Convert.ToDecimal(row["IS_OPENING"]) == 0) ||
                           (transType == 0)
                           select Convert.ToString(row["CURRENCY_NAME"])).Distinct().OrderBy(k => k);

            string ColumnPrefix = "Deposit_";
            if(transType==2)
                ColumnPrefix = "Withdraw_";
            else if (transType == 0)
                ColumnPrefix = "Balance_";

            foreach (var strCurrencyName in results)
            {
                dtTransaction.Columns.Add(ColumnPrefix+ strCurrencyName);
            }
            dtTransaction.AcceptChanges();
        }

        private void GetTransactionCurrencyColumns(string transactionType, DataTable dtTransaction, List<string> listCurrencyColumns)
        {
            var amountColumns = dtTransaction.Columns.Cast<DataColumn>()
                  .Where(c => c.ColumnName.StartsWith(transactionType, StringComparison.InvariantCultureIgnoreCase));

            foreach (DataColumn colToFindSum in amountColumns)
            {
                listCurrencyColumns.Add(colToFindSum.ColumnName);
            }
        }
    }
