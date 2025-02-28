const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload image")
  }

  const data = await response.json()
  return data.data.url
}

