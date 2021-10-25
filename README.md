# amplify-authenticator-react-custom

A set of hooks and a component to easily implement completely custom auth components while using AWS Amplify / Cognito.

## Usage

Any components wrapped in `Authenticator` will be protected by the user being signed in.

```typescript
import { Authenticator } from "amplify-authenticator-react-custom";

const TestPage = () => {
    return (
        <Authenticator>
            <ProtectedComponent />
        </Authenticator>
    );
};
```

Unlike the normal authenticator, the components are not provided, your custom components are used instead, load them in using the components prop

```typescript
import { Authenticator } from "amplify-authenticator-react-custom";

const TestPage = () => {
    return (
        <Authenticator components={{ signIn: <SignInComponent /> }}>
            <ProtectedComponent />
        </Authenticator>
    );
};
```

To create components, use the provided hooks, here is a sign in example (a bit of pseudo-code, but should get the point across):

```typescript
const SignInComponent = () => {
    const signIn = useSignIn();

    return (<form onSubmit={signIn}>
        <input name="email" />
        <input name="password">
        <button type="submit">
    </form>)
}
```
