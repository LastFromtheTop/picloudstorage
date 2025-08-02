'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Cloud } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      if (values.email === 'user@example.com' && values.password === 'password') {
        localStorage.setItem('user-session', JSON.stringify({ email: values.email, name: 'Demo User' }));
        toast({
          title: 'Login Successful',
          description: "Welcome back!",
        });
        router.push('/');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password.',
        });
        setIsLoading(false);
      }
    }, 1000);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a192f] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <Cloud className="mx-auto h-12 w-12 text-[#c4d3f2]" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#e6f1ff]">
            PiCloudStorage
          </h1>
          <p className="mt-2 text-sm text-[#8892b0]">
            Sign in to access your media
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="rounded-lg bg-[#112240] p-8 shadow-xl">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#c4d3f2]">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="user@example.com"
                          {...field}
                          className="border-[#233554] bg-[#0a192f] text-[#e6f1ff] placeholder:text-[#8892b0] focus:ring-[#A0C4FF]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#c4d3f2]">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="border-[#233554] bg-[#0a192f] text-[#e6f1ff] placeholder:text-[#8892b0] focus:ring-[#A0C4FF]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#A0C4FF] text-primary-foreground hover:bg-[#a0c4ff]/90" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="text-center text-xs text-[#8892b0]">
                <p>Use user@example.com / password</p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
