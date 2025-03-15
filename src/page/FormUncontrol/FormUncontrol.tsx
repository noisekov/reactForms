import { z } from 'zod';
import styles from './FormUncontrol.module.css';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type formData = {
  name: string;
  age: number;
  email: string;
  password: string;
  repeatPassword: string;
  sex: string;
  terms: boolean;
};

const FormUncontrol = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: formData = {
      name: '',
      age: 0,
      email: '',
      password: '',
      repeatPassword: '',
      sex: '',
      terms: false,
    };

    for (const input of event.target) {
      if (input.name === 'terms') {
        formData[input.name] = input.checked;

        continue;
      }

      formData[input.name] = input.value;
    }

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
        // sex: z.string().email({ message: 'Invalid email address' }),
        // terms: z.string().email({ message: 'Invalid email address' }),
        // image: z.string().email({ message: 'Invalid email address' }),
        // country: z.string().email({ message: 'Invalid email address' }),
      })
      .refine((data) => data.password === data.repeatPassword, {
        message: "Passwords don't match",
        path: ['repeatPassword'],
      });

    try {
      formValidation.parse(formData);
      const success = formValidation.safeParse(formData);

      Object.keys(success.data).forEach((errElem) => {
        if (formRef.current) {
          formRef.current[`err-${errElem}`].value = '';
        }
      });
    } catch (err) {
      console.log(err);
      const dataForm = Object.keys(formData).filter(
        (elem) => !elem.includes('err')
      );

      dataForm.forEach((elem) => {
        const errorElem = err.issues.find(
          (errElem) => errElem.path[0] === elem
        );

        if (formRef.current) {
          if (errorElem) {
            formRef.current[`err-${elem}`].value = errorElem.message;

            return;
          }

          formRef.current[`err-${elem}`].value = '';
        }
      });

      if (err.issues.length) return;
    }

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
          <option disabled>-- Choose sex --</option>
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
