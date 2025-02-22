import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-react";
import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
const Signin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter();

// Handle the submission of the sign-in form
const onSignInPress = useCallback(async () => {
  if (!isLoaded) return

  // Start the sign-in process using the email and password provided
  try {
    
    const signInAttempt = await signIn.create({
      identifier: form.email,
      password: form.password,
    })
    
    // If sign-in process is complete, set the created session as active
    // and redirect the user
    if (signInAttempt.status === 'complete') {
      await setActive({ session: signInAttempt.createdSessionId })
      router.replace('/(root)/(tabs)/home')
    } else {
      // If the status isn't complete, check why. User might need to
      // complete further steps.
      console.error(JSON.stringify(signInAttempt, null, 2))
    }
  } catch (err: any) {
    console.log(err);
    
    // See https://clerk.com/docs/custom-flows/error-handling
    // for more info on error handling
    Alert.alert('Error', err.errors[0].longMessage)
  }
}, [isLoaded, form.email, form.password])


  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View>
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="font-JakartaSemiBold absolute bottom-5 left-5 text-2xl text-black ">
            Welcome
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter your Email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your Password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton title="Sign In" onPress={onSignInPress} className="mt-6"/>

          {/* Oauth */}
          <OAuth/>
          
          <Link href="/sign-up" className="text-lg text-center text-general-200 mt-10">
            <Text>Don't have an account? </Text>
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>

        {/* verification modal */}
      </View>
    </ScrollView>
  );
};

export default Signin;
