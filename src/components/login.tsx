"use client";
import React from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "./ui/separator";

function LoginForm() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const handleOAuthSignIn = async (
    strategy: "oauth_google" | "oauth_github"
  ) => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch (error) {
      console.error("OAuth login error:", error);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Choose a provider to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 max-w-sm min-w-sm">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn("oauth_google")}
          >
            <FaGoogle /> Login with Google 
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn("oauth_github")}
          >
            <FaGithub /> Login with GitHub 
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-1/2"><h1 className="text-2xl absolute top-8 left-8">News Freed</h1></div>
      <Separator orientation="vertical" />
      <div className="w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}
