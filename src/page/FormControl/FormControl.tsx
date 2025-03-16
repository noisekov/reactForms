import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './FormControl.module.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { addData } from '../../features/dataSlice';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

interface IFormData {
  name: string;
  age: number;
  email: string;
  password: string;
  repeatPassword: string;
  sex: string;
  terms: boolean;
  country: string;
  image: FileList | ArrayBuffer | null | string;
}

const FILE_SIZE_LIMIT = 1024 * 1024; // 1MB
const SPECIAL_CHARS = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
const hasNumber = /\d/;
const hasUppercase = /[A-Z]/;
const hasLowercase = /[a-z]/;
const hasSpecialChar = new RegExp(
  `[${SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`
);

const readFileAsBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function FormControl() {
  const validatePassword = (password: string) => {
    let passedConditions = 0;

    if (hasNumber.test(password)) passedConditions++;
    if (hasUppercase.test(password)) passedConditions++;
    if (hasLowercase.test(password)) passedConditions++;
    if (hasSpecialChar.test(password)) passedConditions++;

    if (ref.current === null) return false;

    switch (passedConditions) {
      case 1:
        ref.current.style.display = 'block';
        ref.current.style.width = '25%';
        ref.current.style.height = '2px';
        ref.current.style.background = 'red';
        break;
      case 2:
        ref.current.style.width = '50%';
        ref.current.style.background = 'orange';
        break;
      case 3:
        ref.current.style.width = '75%';
        ref.current.style.background = 'yellow';
        break;
      case 4:
        ref.current.style.width = '100%';
        ref.current.style.background = 'green';
        break;
      default:
        ref.current.style.display = 'none';
        break;
    }

    return passedConditions === 4;
  };

  const formValidation = z
    .object({
      name: z
        .string()
        .min(1, { message: 'First letter must be uppercased' })
        .refine((val) => val[0] === val[0]?.toUpperCase(), {
          message: `First letter must be uppercased`,
        }),
      age: z.preprocess(
        (val) => +z.string().parse(val),
        z.number().positive('No negative values')
      ),
      email: z.string().email({ message: 'Invalid email address' }),
      password: z.string().refine((password) => validatePassword(password), {
        message:
          ' 1 number, 1 uppercased letter, 1 lowercased letter, 1 special character',
      }),
      repeatPassword: z.string(),
      sex: z.string().refine((val) => val !== 'choose', {
        message: `Choose gender`,
      }),
      terms: z.boolean().refine((val) => val === true, {
        message: `Accept terms`,
      }),
      image: z
        .union([
          z.string(),
          z.instanceof(FileList),
          z.instanceof(ArrayBuffer),
          z.null(),
        ])
        .refine(
          (files) => {
            if (!(files instanceof FileList)) return true;

            return files.length > 0;
          },
          {
            message: 'No files selected',
          }
        )
        .refine(
          (file) => {
            if (!(file instanceof FileList)) return true;

            return ['image/png', 'image/jpeg'].includes(file[0]?.type);
          },
          {
            message: 'Invalid image file type',
          }
        )
        .refine(
          (file) => {
            if (!(file instanceof FileList)) return true;

            return file[0]?.size <= FILE_SIZE_LIMIT;
          },
          {
            message: 'File size should not exceed 1MB',
          }
        ),
      country: z.string().refine((val) => !!val, {
        message: `Choose country`,
      }),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: "Passwords don't match",
      path: ['repeatPassword'],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(formValidation),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef<HTMLSpanElement>(null);

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    if (data.image instanceof FileList) {
      const file = data.image[0];

      if (file && file instanceof File) {
        const base64String = await readFileAsBase64(file);
        data.image = base64String;
      }
    }

    dispatch(addData(data));
    navigate('/reactForms');
  };

  return (
    <div>
      <p>Form Control</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input placeholder="Name" {...register('name')} />
        <output className={styles.error}>{errors.name?.message}</output>
        <input type="number" placeholder="Age" {...register('age')} />
        <output className={styles.error}>{errors.age?.message}</output>
        <input type="email" placeholder="Email" {...register('email')} />
        <output className={styles.error}>{errors.email?.message}</output>
        <input
          type="password"
          placeholder="Password"
          {...register('password')}
        />
        <span className={styles.passwordStrength} ref={ref}></span>
        <output className={styles.error}>{errors.password?.message}</output>
        <input
          type="password"
          placeholder="Repeat password"
          {...register('repeatPassword')}
        />
        <output className={styles.error}>
          {errors.repeatPassword?.message}
        </output>
        <select {...register('sex')}>
          <option value="choose">-- Choose gender --</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <output className={styles.error}>{errors.sex?.message}</output>
        <label className={styles.label}>
          <input type="checkbox" {...register('terms')} />
          Accept terms and conditions agreement
        </label>
        <output className={styles.error}>{errors.terms?.message}</output>
        <input {...register('image')} type="file" />
        <output className={styles.error}>{errors.image?.message}</output>
        <label className={styles.label}>
          <input type="text" list="countries" {...register('country')} />
          Country
          <datalist id="countries">
            {['Ukraine', 'Russia', 'Belarus', 'Poland', 'Germany'].map(
              (country, index) => (
                <option key={index} value={country} />
              )
            )}
          </datalist>
        </label>
        <output className={styles.error}>{errors.country?.message}</output>
        <button className={styles.button} name="submit" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
