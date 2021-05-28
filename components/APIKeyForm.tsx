import React from "react";

interface Props {
  setApiKey: (
    apiKey: string,
    jwPlayerAPIKey: string,
    jwPlayerSecret: string
  ) => void;
}
const APIKeyForm: React.FC<Props> = ({ setApiKey }) => {
  const submitHandler = (event: React.SyntheticEvent) => {
    const {
      apiKey,
      jwPlayerAPIKey,
      jwPlayerSecret,
    } = event.target as HTMLFormElement;

    setApiKey(apiKey.value, jwPlayerAPIKey.value, jwPlayerSecret.value);
  };

  return (
    <form
      className="px-4 h-3/5 flex justify-center flex-col lg:max-w-screen-md m-auto"
      onSubmit={submitHandler}
    >
      <label htmlFor="apiKey">Livepeer.com:</label>
      <input
        type="text"
        placeholder="Enter your api key"
        className="border active:border-livepeer p-2 w-full rounded mb-8"
        name="apiKey"
        required
      />

      <label htmlFor="apiKey">JWPlayer:</label>
      <input
        type="text"
        placeholder="Enter JWPlayer API Key"
        className="border active:border-livepeer p-2 w-full rounded mb-2"
        name="jwPlayerAPIKey"
        required
      />
      <input
        type="text"
        placeholder="Enter JWPlayer API Secret"
        className="border active:border-livepeer p-2 w-full rounded mb-4"
        name="jwPlayerSecret"
        required
      />
      <button
        type="submit"
        className="border border-1 border-black rounded px-4 py-2 lg:w-24 mx-auto"
      >
        Submit
      </button>
      <div className="pt-6 pb-2 text-sm text-gray-800">
        Find out how to get your Livepeer.com API key{" "}
        <a
          href="https://livepeer.com/docs/guides/api-keys/create-an-api-key"
          className="text-blue-500 underline"
        >
          here
        </a>
      </div>
      <div className="pb-6 text-sm text-gray-800">
        Learn more about the JWPlayer API{" "}
        <a
          href="https://developer.jwplayer.com/jwplayer/docs/getting-started-with-content-management"
          className="text-red-500 underline"
        >
          here
        </a>
      </div>
    </form>
  );
};

export default APIKeyForm;
