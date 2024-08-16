export async function generatePost(postPrompt: PostPrompt) {
  return await fetch("/api/posts/generatePost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postPrompt),
  });
}

export async function getPosts() {
  const res = await fetch("/api/posts/getPosts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  const data = await res.json();

  return data.posts;
}

export async function deletePost(_id: string) {
  const res = await fetch("/api/posts/deletePost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id }),
  });

  const data = await res.json();

  return data;
}

export async function getProfile() {
  const res = await fetch("/api/profile/getProfile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  const data = await res.json();

  return data.profile;
}

// export async function addCredits() {
//   const res = await fetch("/api/credits/addCredits", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const data = await res.json();

//   // Use the below to redirect user to Stripe checkout when clicking
//   // the buy credits button. This url will be provided
//   // by the session
//   window.location.href = data.session.url;
// }

export async function addCredits() {
  try {
    const res = await fetch("/api/credits/addCredits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is OK (status 200-299)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Attempt to parse the JSON response
    const data = await res.json();

    // Validate that the session URL exists
    // Direct users to checkout
    if (data?.session?.url) {
      window.location.href = data.session.url;
    } else {
      throw new Error("Session URL not found in the response.");
    }
  } catch (error) {
    console.error("Error adding credits:", error);
    // Optionally, handle the error (e.g., display a message to the user)
  }
}

// export async function addCredits() {
//   try {
//     const res = await fetch("/api/credits/addCredits", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     // Check if the response is OK (status 200-299)
//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     // Attempt to parse the JSON response
//     let data;
//     try {
//       data = await res.json();
//     } catch (error) {
//       throw new Error(
//         "Failed to parse JSON. The response might be empty or malformed."
//       );
//     }

//     // Use the below to redirect user to Stripe checkout when clicking
//     // the buy credits button. This url will be provided
//     // by the session
//     if (data && data.session && data.session.url) {
//       window.location.href = data.session.url;
//     } else {
//       throw new Error("The session URL is not available in the response.");
//     }
//   } catch (error) {
//     console.error("Error adding credits:", error);
//     // Optionally, handle the error (e.g., display a message to the user)
//   }
// }
