import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from 'react-native-modal';

const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: ""
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({
        ...verification,
        state: "pending",
      })
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      // console.error(JSON.stringify(err, null, 2))
      Alert.alert('Error', err.errors[0].longMessage)
    }
  }

 // Handle submission of verification form
 const onVerifyPress = async () => {
  if (!isLoaded) return

  try {
    // Use the code the user provided to attempt verification
    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code: verification.code,
    })

    // If verification was completed, set the session to active
    // and redirect the user
    if (signUpAttempt.status === 'complete') {
      // Create a database user
      await fetchAPI('/(api)/user', {
        method: 'POST',
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          clerkId: signUpAttempt.createdUserId,
        }),
      })
      await setActive({ session: signUpAttempt.createdSessionId })
      setVerification({
        ...verification,
        state: "success"
      })
    } else {
      // If the status is not complete, check why. User may need to
      setVerification({
        ...verification,
        error: "Verification Failed",
        state: "failed"
      })
      // complete further steps.
      
      console.error(JSON.stringify(signUpAttempt, null, 2))
    }
  } catch (err: any) {
    // See https://clerk.com/docs/custom-flows/error-handling
    setVerification({
      ...verification,
      error: "Verification Failed",
      state: "failed"
    })
    // for more info on error handling
    Alert.alert('Error', err.errors[0].longMessage)
  }
}
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View>
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="font-JakartaSemiBold absolute bottom-5 left-5 text-2xl text-black ">
            Create Your Account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your Name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
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

          <CustomButton title="Sign up" onPress={onSignUpPress} className="mt-6"/>

          {/* Oauth */}
          <OAuth/>

          <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        <ReactNativeModal isVisible={verification.state === "pending"}
         onModalHide={() =>{ 
          if(verification.state === "success") setShowSuccessModal(true)
         }}
         >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">Verification</Text>
            <Text className="font-Jakarta mb-5">we have a verification email to {form.email}</Text>
            <InputField label="Code" icon={icons.lock} placeholder="12345" value={verification.code} keyboardType="numeric" onChangeText={(code) => setVerification({...verification, code})}/>
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton title="Verify Email" onPress={onVerifyPress} className="mt-5 bg-success-500"/>
          </View>
        </ReactNativeModal>

        {/* verification modal */}
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5"/>
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-grey-400 font-Jakarta text-center mt-2">You have successfully verified your account.</Text>
            <CustomButton title="Browse Home" onPress={()=> {
              setShowSuccessModal(false)
              router.push("/(root)/(tabs)/home");
            }} className="mt-5"/>
              
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default Signup;
