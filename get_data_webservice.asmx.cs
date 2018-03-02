 using (SqlConnection con = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("UspEmployeeValidLogin", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@EmpName", SqlDbType.VarChar).Value = employeeName;
                        cmd.Parameters.Add("@EmpPassword", SqlDbType.VarChar).Value = password;
                        con.Open();
                        cmd.ExecuteNonQuery();
                        var dataReader = cmd.ExecuteReader();
                        DataTable dataTable = new DataTable();
                        dataTable.Load(dataReader);
                        if (dataTable.Rows.Count > 0)
                        {
                            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
                            Dictionary<string, object> row;
                            foreach (DataRow dr in dataTable.Rows)
                            {
                                row = new Dictionary<string, object>();
                                foreach (DataColumn col in dataTable.Columns)
                                {
                                    row.Add(col.ColumnName, dr[col]);
                                }
                                rows.Add(row);
                            }
                            return serializer.Serialize(rows);
                        }
                        else
                        {
                            return "";
                        }
                        //con.Close();
                        //return JsonConvert.SerializeObject(dataTable, Newtonsoft.Json.Formatting.Indented);                     
                    }
                }  
            }
            catch (Exception ex)
            {
                throw ex;
            }
