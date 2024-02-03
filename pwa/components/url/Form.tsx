import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Url } from "../../types/Url";

interface Props {
  url?: Url;
}

interface SaveParams {
  values: Url;
}

interface DeleteParams {
  id: string;
}

const saveUrl = async ({ values }: SaveParams) =>
  await fetch<Url>(!values["@id"] ? "/urls" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteUrl = async (id: string) =>
  await fetch<Url>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ url }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Url> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveUrl(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Url> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteUrl(id), {
    onSuccess: () => {
      router.push("/urls");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!url || !url["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: url["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/urls"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {url ? `Edit Url ${url["@id"]}` : `Create Url`}
      </h1>
      <Formik
        initialValues={
          url
            ? {
                ...url,
              }
            : new Url()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/urls");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="url_longUrl"
              >
                longUrl
              </label>
              <input
                name="longUrl"
                id="url_longUrl"
                value={values.longUrl ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.longUrl && touched.longUrl ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.longUrl && touched.longUrl ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="longUrl"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="url_shortUrl"
              >
                shortUrl
              </label>
              <input
                name="shortUrl"
                id="url_shortUrl"
                value={values.shortUrl ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.shortUrl && touched.shortUrl ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.shortUrl && touched.shortUrl ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="shortUrl"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="url_createDate"
              >
                createDate
              </label>
              <input
                name="createDate"
                id="url_createDate"
                value={values.createDate?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.createDate && touched.createDate
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.createDate && touched.createDate ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="createDate"
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {url && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
