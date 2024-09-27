import axios from "axios";
import { useState } from "react";
export default function useUpdateData() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const updateData = async (method, path, body,headers) => {
    setLoading(true);
    setSuccess(false);
    try {
      let res;
      if (method == "delete") {
        res = await axios.delete(
          path,
          {
            withCredentials:true,
            
            data:body
          }
        );
      }else{
      res = await axios[method](
        path,
      body,
        {
          withCredentials: true,
          headers: headers||{
            "Content-Type": "application/json",
          },
        }
      );
    }

      setSuccess(true);
      return res.data;
    } catch (error) {
      setSuccess(false);
      return error.response ? error.response.data : { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  return { updateData, loading,success };
}
