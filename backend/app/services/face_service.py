from deepface import DeepFace


def verify_faces(img1_path, img2_path):

    try:

        result = DeepFace.verify(
            img1_path=img1_path,
            img2_path=img2_path,
            enforce_detection=False
        )

        return result["verified"]

    except Exception:

        return False