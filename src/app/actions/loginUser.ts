import { signIn } from "next-auth/react";

async function loginUser(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  try {
    // Sign in the user using next-auth with the OAuth2 provider
    const result = await signIn("example-oauth2", {
      email,
      password,
      redirect: false, // Set to false to handle the response manually
    });

    if (result?.error) {
      return { success: false, message: result.error };
    }

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export default loginUser;