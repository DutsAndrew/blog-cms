import styles from './page.module.css';
import uniqid from 'uniqid';

export default function Home() {

  const crudOperations = ["Create Post", "Update Post", "Delete Post", "Account Management"];

  return (
    <main className={styles.cmsCardsContainer}>
      {crudOperations.map((operation) => {
        return <div className={styles.operationContainer} key={uniqid()}>
          <p className={styles.operationText}>
            {operation}
          </p>
        </div>
      })}
    </main>
  )
}