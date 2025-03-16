import { z } from 'zod';
import styles from './FormUncontrol.module.css';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addData } from '../../features/dataSlice';

interface formData {
  name: string;
  age: number;
  email: string;
  password: string;
  repeatPassword: string;
  sex: string;
  terms: boolean;
  country: string;
  image: string;
}

const FormUncontrol = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formData: formData = {
    name: '',
    age: 0,
    email: '',
    password: '',
    repeatPassword: '',
    sex: '',
    terms: false,
    country: '',
    image: '',
  };

  const formValidation = z
    .object({
      name: z.string().refine((val) => val[0] === val[0].toUpperCase(), {
        message: `First letter must be uppercased`,
      }),
      age: z.preprocess(
        (val) => +z.string().parse(val),
        z.number().positive('No negative values')
      ),
      email: z.string().email({ message: 'Invalid email address' }),
      password: z.string().refine(
        (password) => {
          return password.split('').some((char) => {
            if (typeof +char === 'number' && !Number.isNaN(+char)) {
              return true;
            }
          });
        },
        {
          message: `1 number, 1 uppercased letter, 1 lowercased letter, 1 special character`,
        }
      ),
      repeatPassword: z.string(),
      sex: z.string().refine((val) => val !== 'choose', {
        message: `Choose gender`,
      }),
      // terms: z.string().email({ message: 'Invalid email address' }),
      // image: z.string().email({ message: 'Invalid email address' }),
      // country: z.string().email({ message: 'Invalid email address' }),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: "Passwords don't match",
      path: ['repeatPassword'],
    });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    for (const input of event.target as HTMLFormElement) {
      const inputElement = input as HTMLInputElement | HTMLSelectElement;

      if (inputElement.name.includes('err') || inputElement.name === 'submit') {
        continue;
      }

      if (inputElement.name === 'terms') {
        formData[inputElement.name] = (
          inputElement as HTMLInputElement
        ).checked;

        continue;
      }

      if (inputElement.name === 'image') {
        const inputElementWithFiles = inputElement as HTMLInputElement & {
          files: FileList | null;
        };
        const file = inputElementWithFiles.files?.[0];

        if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = async () => {
            // const base64String = reader.result;
            // formData[inputElement.name] = base64String;
          };
        }

        continue;
      }

      (formData[inputElement.name as keyof formData] as string) =
        inputElement.value;
    }

    try {
      formValidation.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        Object.keys(formData).forEach((elem) => {
          const errorElem = err.issues.find(
            (errElem) => errElem.path[0] === elem
          );

          if (formRef.current) {
            if (!errorElem) {
              (formRef.current[`err-${elem}`] as HTMLInputElement).value = '';

              return;
            }

            (formRef.current[`err-${elem}`] as HTMLInputElement).value =
              errorElem.message;
          }
        });
      }

      const zodError = err as z.ZodError;
      if (zodError.issues.length) return;
    }

    dispatch(addData(formData));
    navigate('/reactForms');
  };

  return (
    <>
      <form ref={formRef} className={styles.form} onSubmit={submit}>
        <input type="text" name="name" placeholder="Name" />
        <output className={styles.error} name="err-name"></output>
        <input type="text" name="age" placeholder="Age" />
        <output className={styles.error} name="err-age"></output>
        <input type="email" name="email" placeholder="Email" />
        <output className={styles.error} name="err-email"></output>
        <input type="password" name="password" placeholder="Password" />
        <output className={styles.error} name="err-password"></output>
        <input
          type="password"
          name="repeatPassword"
          placeholder="Repeat password"
        />
        <output className={styles.error} name="err-repeatPassword"></output>
        <select name="sex">
          <option value="choose">-- Choose sex --</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <output className={styles.error} name="err-sex"></output>
        <label className={styles.label}>
          <input type="checkbox" name="terms" />
          Accept terms and conditions agreement
        </label>
        <output className={styles.error} name="err-terms"></output>
        <input name="image" type="file" />
        <output className={styles.error} name="err-image"></output>
        <label className={styles.label}>
          <input type="text" name="country" list="countries" />
          Country
          <datalist id="countries">
            {['Ukraine', 'Russia', 'Belarus', 'Poland', 'Germany'].map(
              (country, index) => (
                <option key={index} value={country} />
              )
            )}
          </datalist>
        </label>
        <output className={styles.error} name="err-country"></output>
        <button name="submit" type="submit">
          Submit
        </button>
      </form>
    </>
  );
};

export default FormUncontrol;
